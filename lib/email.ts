import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER_HOST,
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
})

export interface EmailOptions {
  to: string
  subject: string
  text?: string
  html?: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
  }>
}

export async function sendEmail(options: EmailOptions): Promise<void> {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments
    })
  } catch (error) {
    console.error('Error sending email:', error)
    throw new Error('Failed to send email')
  }
}

export async function sendOTPEmail(email: string, otp: string): Promise<void> {
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <div style="text-align: center; margin-bottom: 20px;">
        <h2 style="color: #10b981;">Smart Solar Password Reset</h2>
      </div>
      <div style="padding: 20px; background-color: #f9fafb; border-radius: 6px;">
        <p>Hello,</p>
        <p>We received a request to reset your password. Use the following OTP code to proceed:</p>
        <div style="text-align: center; padding: 15px; margin: 20px 0; background-color: #f0fdf4; border-radius: 4px;">
          <h2 style="color: #047857; margin: 0; font-size: 28px; letter-spacing: 5px;">${otp}</h2>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
      </div>
      <div style="text-align: center; margin-top: 20px; color: #6b7280; font-size: 12px;">
        <p>© ${new Date().getFullYear()} Smart Solar. All rights reserved.</p>
      </div>
    </div>
  `;

  await sendEmail({
    to: email,
    subject: "Password Reset OTP Code",
    html: htmlContent
  });
}

// Verify the transporter connection
export async function verifyEmailConfig(): Promise<boolean> {
  try {
    await transporter.verify()
    return true
  } catch (error) {
    console.error('Email configuration error:', error)
    return false
  }
}
