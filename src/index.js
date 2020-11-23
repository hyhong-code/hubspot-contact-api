require("dotenv").config();
const axios = require("axios");
const express = require("express");

const app = express();

app.get("/contacts", async (req, res, next) => {
  try {
    const contacts = `https://api.hubapi.com/contacts/v1/lists/all/contacts/recent?hapikey=${process.env.HUBSPOT_API_KEY}`;

    const { data } = await axios.get(contacts);

    res.json(data);
  } catch (error) {
    console.error(error);
  }
});

const port = 3000;

app.listen(port, () => console.log(`Server up on port ${port}...`));
