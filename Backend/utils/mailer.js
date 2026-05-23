import nodemailer from "nodemailer";

const isMailConfigured = () =>
  Boolean(process.env.SMTP_EMAIL && process.env.SMTP_APP_PASSWORD);

export const createTransporter = () => {
  if (!isMailConfigured()) {
    return null;
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_APP_PASSWORD,
    },
  });
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const transporter = createTransporter();

  if (!transporter) {
    throw new Error("Gmail SMTP is not configured");
  }

  return transporter.sendMail({
    from: process.env.SMTP_EMAIL,
    to,
    subject,
    html,
    text,
  });
};
