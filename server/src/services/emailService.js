import nodemailer from 'nodemailer';
import logger from '../utils/logger.js';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Aurelia Jewels" <${process.env.SMTP_FROM || 'no-reply@aureliajewels.com'}>`,
      to,
      subject,
      html,
    });
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send failed:', error);
    throw error;
  }
};

export const sendOrderConfirmation = async (order, user) => {
  const html = `
    <h1>Order Confirmed!</h1>
    <p>Dear ${user.name},</p>
    <p>Your order <strong>#${order.orderNumber}</strong> has been placed successfully.</p>
    <p>Total: ₹${order.total}</p>
    <p>We'll notify you when it ships.</p>
  `;
  return sendEmail({ to: user.email, subject: `Order #${order.orderNumber} Confirmed`, html });
};

export const sendPasswordReset = async (user, token) => {
  const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${token}`;
  const html = `
    <h1>Password Reset</h1>
    <p>Click <a href="${resetUrl}">here</a> to reset your password. This link expires in 1 hour.</p>
  `;
  return sendEmail({ to: user.email, subject: 'Password Reset - Aurelia Jewels', html });
};

export const sendWelcomeEmail = async (user) => {
  const html = `
    <h1>Welcome to Aurelia Jewels!</h1>
    <p>Dear ${user.name},</p>
    <p>Thank you for creating an account. Start exploring our exquisite collection.</p>
  `;
  return sendEmail({ to: user.email, subject: 'Welcome to Aurelia Jewels', html });
};

export const sendVerificationEmail = async (user, token) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
  const html = `
    <h1>Verify Your Email</h1>
    <p>Dear ${user.name},</p>
    <p>Click <a href="${verifyUrl}">here</a> to verify your email address.</p>
  `;
  return sendEmail({ to: user.email, subject: 'Verify your email - Aurelia Jewels', html });
};
