import nodemailer from "nodemailer";
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;

console.log(APP_PASSWORD, SENDER_EMAIL);


export async function sendEmail(to: string, body: string) {
  if (!to || !body) {
    console.log(`Error invalid inputs`);
  }
console.log(SENDER_EMAIL);

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SENDER_EMAIL,
      pass: APP_PASSWORD,
    },
    // logger: true,
    // debug: true
  });
  const mailOptions = {
    from: SENDER_EMAIL,
    to: to,
    subject: "Test",
    text: body,
   
  };
  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent successfully to ${to}`);
    console.log({
      success: true,
      message: `Email successfully sent to ${to}!`,
    });
  } catch (error: any) {
    console.error("Error sending email:", error);
    console.log({
      success: false,
      message: "Failed to send email. Check server logs for details.",
      error: error.message,
    });
  }
}
