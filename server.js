require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Nodemailer transporter (Hostinger SMTP Configuration)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true, // Use SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// API to send email
app.post("/send-email", async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ success: false, message: "Receiver email is required" });
        }

        const mailOptions = {
            from: `"NCC Urban Lake Springs" <${process.env.SMTP_USER}>`,
            to: email, // Dynamic recipient email
            subject: "Thanks for Connecting with NCC Urban Lake Springs",
            html: `
                <p><strong>Thanks for connecting with NCC Urban Lake Springs!</strong></p>
                <p>We appreciate your interest. Please find some details below.</p>
                <p>
                    📞 Contact us on WhatsApp: 
                    <a href="https://wa.me/9945264555" target="_blank" style="color:green; font-weight:bold;">
                        9945264555
                    </a>
                </p>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log("✅ Email Sent:", info.response);
        res.status(200).json({ success: true, message: "Email sent successfully!" });
    } catch (error) {
        console.error("❌ Error Sending Email:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
