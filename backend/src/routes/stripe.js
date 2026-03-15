const express = require('express')
const router = express.Router()
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder')

// Create Stripe Payment Intent
router.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'usd', orderId } = req.body

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe uses cents
      currency: currency.toLowerCase(),
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        orderId: orderId?.toString() || 'pending'
      }
    })

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    })
  } catch (error) {
    console.error('Stripe payment intent error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Confirm Stripe Payment
router.post('/confirm-payment', async (req, res) => {
  try {
    const { paymentIntentId, orderId } = req.body

    // Retrieve the payment intent to check status
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)

    if (paymentIntent.status === 'succeeded') {
      // Update order status in database
      const db = req.app.get('db')
      
      db.run(
        `UPDATE orders SET 
         payment_status = 'paid',
         payment_method = 'stripe',
         stripe_payment_id = ?,
         updated_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
        [paymentIntentId, orderId],
        (err) => {
          if (err) {
            console.error('Database update error:', err)
            return res.status(500).json({
              success: false,
              error: 'Failed to update order'
            })
          }

          res.json({
            success: true,
            message: 'Payment confirmed',
            orderId
          })
        }
      )
    } else {
      res.json({
        success: false,
        error: 'Payment not completed',
        status: paymentIntent.status
      })
    }
  } catch (error) {
    console.error('Stripe confirm payment error:', error)
    res.status(500).json({
      success: false,
      error: error.message
    })
  }
})

// Webhook endpoint for Stripe events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature']
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  let event

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return res.status(400).send(`Webhook Error: ${err.message}`)
  }

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object
      console.log('PaymentIntent was successful:', paymentIntent.id)
      // Update order status
      break
    case 'payment_intent.payment_failed':
      const failedPayment = event.data.object
      console.log('PaymentIntent failed:', failedPayment.id)
      break
    default:
      console.log(`Unhandled event type ${event.type}`)
  }

  res.json({ received: true })
})

module.exports = router
