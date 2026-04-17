const express = require('express');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
const port = process.env.PORT || 6262;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/inquiry', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'inquiry.html'));
});

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Urbanwerkzsg@gmail.com',
        pass: 'huathuathuat'
    }
});

app.post('/api/contact', async (req, res) => {
    const { name, email, phone, service, message } = req.body;

    if (!name || (!email && !phone)) {
        return res.status(400).json({ error: "Name and at least one contact method (Email or Phone) are required." });
    }

    const mailOptions = {
        from: 'Urbanwerkzsg@gmail.com',
        to: 'urbanwerkz@gmail.com',
        subject: `New Inquiry from ${name} - ${service}`,
        text: `You have received a new inquiry from the Pet Resting website.\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nInterested Service: ${service}\nMessage/Requirements:\n${message}\n`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ success: true, message: "Inquiry sent successfully!" });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ error: "Failed to send email. Please try again later." });
    }
});

app.listen(port, "0.0.0.0", () => {
    console.log(`Server is running on port ${port}`);
});
