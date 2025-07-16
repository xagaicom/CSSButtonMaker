import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable not set. Email functionality will be disabled.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  if (!process.env.SENDGRID_API_KEY) {
    console.log("Email would be sent:", params);
    return false;
  }

  try {
    await mailService.send({
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text,
      html: params.html,
    });
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}

export function generatePasswordResetEmail(adminEmail: string, resetToken: string, adminUsername: string): EmailParams {
  const resetUrl = `${process.env.BASE_URL || 'http://localhost:5000'}/admin-panel?reset-token=${resetToken}`;
  
  return {
    to: adminEmail,
    from: process.env.FROM_EMAIL || 'noreply@cssbuttonmaker.com',
    subject: 'CSS Button Maker - Admin Password Reset',
    text: `Hello ${adminUsername},

You have requested a password reset for your CSS Button Maker admin account.

Please use the following reset token to reset your password:
${resetToken}

Or click the following link to reset your password:
${resetUrl}

This token will expire in 1 hour.

If you did not request this password reset, please ignore this email.

Best regards,
CSS Button Maker Team`,
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset - CSS Button Maker</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }
    .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
    .token-box { background: #fff; border: 2px solid #e9ecef; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
    .token { font-family: monospace; font-size: 18px; font-weight: bold; color: #495057; letter-spacing: 2px; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
    .footer { text-align: center; margin-top: 30px; font-size: 14px; color: #6c757d; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>CSS Button Maker</h1>
      <p>Admin Password Reset</p>
    </div>
    
    <div class="content">
      <p>Hello <strong>${adminUsername}</strong>,</p>
      
      <p>You have requested a password reset for your CSS Button Maker admin account.</p>
      
      <div class="token-box">
        <p><strong>Reset Token:</strong></p>
        <div class="token">${resetToken}</div>
      </div>
      
      <p>You can also click the button below to reset your password:</p>
      
      <div style="text-align: center;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <p><strong>Important:</strong> This token will expire in 1 hour.</p>
      
      <p>If you did not request this password reset, please ignore this email.</p>
      
      <div class="footer">
        <p>Best regards,<br>CSS Button Maker Team</p>
      </div>
    </div>
  </div>
</body>
</html>
    `
  };
}