const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  try {
    // Check if SendGrid is configured (preferred for production)
    if (process.env.SENDGRID_API_KEY) {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY);
      
      const msg = {
        to: options.to,
        from: process.env.SENDGRID_FROM_EMAIL || process.env.EMAIL_USER,
        subject: options.subject,
        text: options.text,
        html: options.html
      };
      
      const result = await sgMail.send(msg);
      console.log('✅ SendGrid email sent successfully:', result[0].statusCode);
      return { success: true, messageId: result[0].headers['x-message-id'] };
    } 
    
    // Fallback to Gmail SMTP if SendGrid not configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASSWORD) {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST || 'smtp.gmail.com',
        port: process.env.EMAIL_PORT || 587,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: `CampusX <${process.env.EMAIL_USER}>`,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
      };

      const info = await transporter.sendMail(mailOptions);
      console.log('✅ Gmail SMTP email sent successfully:', info.messageId);
      return { success: true, messageId: info.messageId };
    }
    
    throw new Error('No email service configured. Please set up SendGrid or Gmail SMTP.');
    
  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

module.exports = sendEmail;
