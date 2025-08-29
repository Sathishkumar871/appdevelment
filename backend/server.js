const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // .env ఫైల్‌ను లోడ్ చేయడానికి

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors());

const otpStore = {};

// OTP పంపడానికి
app.post('/send-otp', async (req, res) => {
    const { mobile } = req.body;
    if (!mobile || mobile.length !== 10) {
        return res.status(400).json({ success: false, message: "దయచేసి సరైన 10 అంకెల మొబైల్ నంబర్ ఎంటర్ చేయండి." });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore[mobile] = otp;
    console.log(`Sending OTP to ${mobile}: ${otp}`);

    try {
        await axios.post('https://www.fast2sms.com/dev/bulkV2', {
            variables_values: otp,
            route: "otp",
            numbers: mobile,
        }, {
            headers: {
                // .env ఫైల్ నుండి సురక్షితంగా API కీని తీసుకుంటుంది
                "authorization": process.env.FAST2SMS_API_KEY,
                "Content-Type": "application/json"
            }
        });
        res.json({ success: true, message: "OTP విజయవంతంగా పంపబడింది!" });
    } catch (error) {
        console.error("Error sending OTP:", error.message);
        res.status(500).json({ success: false, message: "OTP పంపడంలో సమస్య ఉంది." });
    }
});

// OTP వెరిఫై చేయడానికి
app.post('/verify-otp', (req, res) => {
    const { mobile, otp } = req.body;
    if (otpStore[mobile] && otpStore[mobile] === otp) {
        delete otpStore[mobile];
        console.log(`Verification successful for ${mobile}`);
        res.json({ success: true, message: "OTP విజయవంతంగా వెరిఫై చేయబడింది!" });
    } else {
        console.log(`Verification failed for ${mobile}.`);
        res.status(400).json({ success: false, message: "మీరు ఎంటర్ చేసిన OTP తప్పు." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ సర్వర్ http://localhost:${PORT} లో విజయవంతంగా రన్ అవుతోంది`);
});