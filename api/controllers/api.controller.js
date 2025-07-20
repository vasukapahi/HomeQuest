import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
import User from '../models/user.model.js';

export const sendInvoice = async (req, res, next) => {
  const { userId, invoiceData } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    // 1. Generate HTML content
    const htmlContent = `
      <html>
        <body>
          <h1>Invoice</h1>
          <p>Name: ${user.username}</p>
          <p>Email: ${user.email}</p>
          <p>Property: ${invoiceData.propertyName}</p>
          <p>Amount: ₹${invoiceData.amount}</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </body>
      </html>
    `;

    // 2. Generate PDF using Puppeteer
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlContent);
    const pdfBuffer = await page.pdf({ format: 'A4' });
    await browser.close();

    // 3. Send Email using Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,       // Your Gmail
        pass: process.env.MAIL_PASS,       // App password
      },
    });

    await transporter.sendMail({
      from: `"HomeQuest" <${process.env.MAIL_USER}>`,
      to: user.email,
      subject: 'Your Invoice',
      text: 'Attached is your invoice.',
      attachments: [
        {
          filename: 'invoice.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    res.status(200).json({ message: 'Invoice sent successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to send invoice' });
  }
};
