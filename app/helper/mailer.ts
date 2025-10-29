import nodemailer from "nodemailer";
import User from "@/lib/models/User";
import bcrypt from "bcryptjs";

export const sendMail = async ({ email, emailType, userId }: any) => {
  try {
    // Generate a token (hashed userId)
    const hashedToken = await bcrypt.hash(userId.toString(), 10);

    if (emailType === "VERIFY") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: hashedToken,
        verifyTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    } else if (emailType === "RESET") {
      await User.findByIdAndUpdate(userId, {
        forgotPasswordToken: hashedToken,
        forgotPasswordTokenExpiry: Date.now() + 3600000, // 1 hour
      });
    }

    // Create email transporter (using Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // your Gmail
        pass: process.env.EMAIL_PASS, // your Gmail App Password
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject:
        emailType === "VERIFY"
          ? "Verify your Email"
          : "Reset your Password",
      html: `<p>
        Click the link below to ${
          emailType === "VERIFY" ? "verify your email" : "reset your password"
        }:
      </p>
      <a href="${process.env.DOMAIN}/${
        emailType === "VERIFY" ? "verifyemail" : "resetpassword"
      }?token=${hashedToken}">Click Here</a>
      <p>This link is valid for only 1 hour.</p>`,
    };

    const mailResponse = await transporter.sendMail(mailOptions);
    return mailResponse;

  } catch (error: any) {
    console.error("Error in sendMail:", error);
    throw new Error(error.message);
  }
};
