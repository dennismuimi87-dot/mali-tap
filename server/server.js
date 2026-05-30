const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Home Route
app.get("/", (req, res) => {
  res.send("Mali Tap M-Pesa Server Running 🚀");
});

// Get Access Token
const getAccessToken = async () => {
  const auth = Buffer.from(
    `${process.env.CONSUMER_KEY}:${process.env.CONSUMER_SECRET}`
  ).toString("base64");

  const response = await axios.get(
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
    {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    }
  );

  return response.data.access_token;
};

// STK Push Route
app.post("/stkpush", async (req, res) => {
  try {
    const token = await getAccessToken();

    res.json({
      success: true,
      message: "STK Push endpoint reached",
      token: token,
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      success: false,
      message: "STK Push Failed",
    });
  }
});

// IMPORTANT FOR RAILWAY
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});