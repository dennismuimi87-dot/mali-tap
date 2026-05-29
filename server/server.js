const express = require("express");

const cors = require("cors");

const axios = require("axios");

require("dotenv").config();

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Mali Tap M-Pesa Server Running 🚀");
});


// GET TOKEN FUNCTION
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


// STK PUSH
app.post("/stkpush", async (req, res) => {

  try {

    const token = await getAccessToken();

    const date = new Date();

    const timestamp =
      date.getFullYear().toString() +
      String(date.getMonth() + 1).padStart(2, "0") +
      String(date.getDate()).padStart(2, "0") +
      String(date.getHours()).padStart(2, "0") +
      String(date.getMinutes()).padStart(2, "0") +
      String(date.getSeconds()).padStart(2, "0");

    const shortcode = "174379";

    const passkey =
      "bfb279f9aa9bdbcf158e97ddf";

    const password = Buffer.from(
      shortcode + passkey + timestamp
    ).toString("base64");

    const response = await axios.post(
      "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
      {
        BusinessShortCode: shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: 1,
        PartyA: "254797122585",
        PartyB: shortcode,
        PhoneNumber: "254797122585",
        CallBackURL: "https://mydomain.com/path",
        AccountReference: "Mali Tap",
        TransactionDesc: "Payment",
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);

  } catch (error) {

    console.log(error.response.data);

    res.send("STK Push Failed");

  }
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});