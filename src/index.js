require("dotenv").config();
const path = require("path");
const axios = require("axios");
const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// List all contacts
app.get("/contacts", async (req, res, next) => {
  try {
    const contacts = `https://api.hubapi.com/contacts/v1/lists/all/contacts/recent?hapikey=${process.env.HUBSPOT_API_KEY}`;

    const { data } = await axios.get(contacts);

    res.json(data);
  } catch (error) {
    console.error(error);
  }
});

// Update favorite books view
app.get("/update", async (req, res, next) => {
  try {
    const { email } = req.query;

    const { data } = await axios.get(
      `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${process.env.HUBSPOT_API_KEY}`
    );

    res.render("update", { userEmail: email, favoriteBook: data.properties.favorite_book.value });
  } catch (error) {
    console.error(error);
  }
});

// Update favorite book
app.post("/update", async (req, res, next) => {
  try {
    const { newVal } = req.body;
    const { email } = req.query;

    const body = {
      properties: [{ property: "favorite_book", value: newVal }],
    };

    await axios.post(
      `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile?hapikey=${process.env.HUBSPOT_API_KEY}`,
      body
    );

    res.redirect("back");
  } catch (error) {
    console.error(error.message);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`🚀 Server up on port ${port}... `));
