const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const paypal = require('@paypal/checkout-server-sdk');
const db = require('../database/db');
const { authenticate } = require('../middleware/auth');

// PayPal 配置
function paypalClient() {
  const environment = process.env.PAYPAL_MODE === 'production'
    ? new paypal.core.LiveEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET)
    : new paypal.core.SandboxEnvironment(process.env.PAYPAL_CLIENT_ID, process.env.PAYPAL_CLIENT_SECRET);
  
  return new paypal.core.PayPalHttpClient(environment);
}

// 创建 Stripe 支付意图
router.post('/stripe/create-intent', authenticate, async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await db.query(
      'SELECT id, total, currency FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user.userId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { total, currency } = order.rows[0];

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(total * 100), // 转换为分
      currency: currency.toLowerCase(),
      metadata: { orderId: orderId.toString() }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Stripe create intent error:', error);
    res.status(500).json({ error: 'Failed to create payment intent' });
  }
});

// Stripe Webhook
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const orderId = paymentIntent.metadata.orderId;

      await db.query(`
        UPDATE orders 
        SET payment_status = 'paid', 
            payment_id = $1, 
            paid_at = CURRENT_TIMESTAMP,
            status = 'processing'
        WHERE id = $2
      `, [paymentIntent.id, orderId]);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    res.status(400).json({ error: 'Webhook error' });
  }
});

// 创建 PayPal 订单（无需认证）
router.post('/paypal/create', async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await db.query(
      'SELECT id, total, currency, order_number FROM orders WHERE id = $1',
      [orderId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { total, currency, order_number } = order.rows[0];

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: order_number,
        amount: {
          currency_code: currency || 'USD',
          value: total.toFixed(2)
        }
      }]
    });

    const paypalOrder = await paypalClient().execute(request);

    res.json({
      id: paypalOrder.result.id
    });
  } catch (error) {
    console.error('PayPal create order error:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// 捕获 PayPal 支付（无需认证）
router.post('/paypal/capture', async (req, res) => {
  const { paypalOrderId, orderId } = req.body;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    const capture = await paypalClient().execute(request);

    if (capture.result.status === 'COMPLETED') {
      await db.query(`
        UPDATE orders 
        SET payment_status = 'paid', 
            payment_method = 'paypal',
            payment_id = $1, 
            paid_at = CURRENT_TIMESTAMP,
            status = 'processing'
        WHERE id = $2
      `, [paypalOrderId, orderId]);

      res.json({ success: true, captureId: capture.result.id });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

// 创建 PayPal 订单（需要认证）
router.post('/paypal/create-order', authenticate, async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await db.query(
      'SELECT id, total, currency, order_number FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user.userId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const { total, currency, order_number } = order.rows[0];

    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        reference_id: order_number,
        amount: {
          currency_code: currency,
          value: total.toFixed(2)
        }
      }]
    });

    const paypalOrder = await paypalClient().execute(request);

    res.json({
      paypalOrderId: paypalOrder.result.id
    });
  } catch (error) {
    console.error('PayPal create order error:', error);
    res.status(500).json({ error: 'Failed to create PayPal order' });
  }
});

// 捕获 PayPal 支付（需要认证）
router.post('/paypal/capture-order', authenticate, async (req, res) => {
  const { paypalOrderId, orderId } = req.body;

  try {
    const request = new paypal.orders.OrdersCaptureRequest(paypalOrderId);
    request.requestBody({});

    const capture = await paypalClient().execute(request);

    if (capture.result.status === 'COMPLETED') {
      await db.query(`
        UPDATE orders 
        SET payment_status = 'paid', 
            payment_method = 'paypal',
            payment_id = $1, 
            paid_at = CURRENT_TIMESTAMP,
            status = 'processing'
        WHERE id = $2
      `, [paypalOrderId, orderId]);

      res.json({ success: true, captureId: capture.result.id });
    } else {
      res.status(400).json({ error: 'Payment not completed' });
    }
  } catch (error) {
    console.error('PayPal capture error:', error);
    res.status(500).json({ error: 'Failed to capture payment' });
  }
});

// 支付宝支付（简化示例）
router.post('/alipay/create', authenticate, async (req, res) => {
  const { orderId } = req.body;

  try {
    const order = await db.query(
      'SELECT id, total, currency, order_number FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user.userId]
    );

    if (order.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // 这里需要集成支付宝 SDK
    // 简化示例，实际需要调用支付宝 API
    
    res.json({
      message: 'Alipay integration placeholder',
      orderId: order.rows[0].id,
      orderNumber: order.rows[0].order_number
    });
  } catch (error) {
    console.error('Alipay create error:', error);
    res.status(500).json({ error: 'Failed to create Alipay payment' });
  }
});

// 获取支付状态
router.get('/status/:orderId', authenticate, async (req, res) => {
  const { orderId } = req.params;

  try {
    const result = await db.query(
      'SELECT payment_status, payment_method, payment_id, paid_at FROM orders WHERE id = $1 AND user_id = $2',
      [orderId, req.user.userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get payment status error:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

module.exports = router;
