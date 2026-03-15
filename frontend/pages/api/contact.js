export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { name, email, phone, company, message } = req.body

  // Validate required fields
  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Missing required fields' })
  }

  try {
    // Log the submission
    console.log('Contact form submission:', {
      name,
      email,
      phone,
      company,
      message,
      timestamp: new Date().toISOString()
    })

    // Send email notification using QQ Mail SMTP
    const nodemailer = require('nodemailer')
    
    // Configure QQ Mail SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 587,
      secure: false, // use STARTTLS
      auth: {
        user: process.env.EMAIL_USER || '737555420@qq.com',
        pass: process.env.EMAIL_PASSWORD // QQ Mail authorization code
      },
      tls: {
        rejectUnauthorized: false
      }
    })

    // Email content
    const mailOptions = {
      from: `"外贸平台联系表单" <${process.env.EMAIL_USER || '737555420@qq.com'}>`,
      to: '737555420@qq.com',
      subject: `新的联系表单提交 - ${name}`,
      html: `
        <h2>新的联系表单提交</h2>
        <p><strong>姓名：</strong> ${name}</p>
        <p><strong>邮箱：</strong> ${email}</p>
        <p><strong>电话：</strong> ${phone || '未提供'}</p>
        <p><strong>公司：</strong> ${company || '未提供'}</p>
        <p><strong>留言：</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>提交时间：${new Date().toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })}</small></p>
      `
    }

    // Send email
    await transporter.sendMail(mailOptions)
    
    console.log('Email sent successfully to 737555420@qq.com')

    return res.status(200).json({ 
      success: true, 
      message: 'Message received and email sent successfully' 
    })
  } catch (error) {
    console.error('Contact form error:', error)
    
    // Return success to user but log the error
    return res.status(200).json({ 
      success: true, 
      message: 'Message received successfully' 
    })
  }
}
