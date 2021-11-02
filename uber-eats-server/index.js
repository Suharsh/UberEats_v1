const express = require("express");
const app = express();
const session = require('express-session');
const bodyParser = require("body-parser");
const login = require("./routes/Login");
const register = require("./routes/Register");
const dishes = require("./routes/Dishes")
const imageUpload = require("./routes/ImageUpload")
const profile = require("./routes/Profile")
const restaurant = require("./routes/Restaurant");
const personalization = require("./routes/Personlization");
const deliveryaddress = require("./routes/DeliveryAddress");
const cors = require("cors");
const orders = require("./routes/Orders");

app.use(cors())


app.use(bodyParser.json());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/uber-eats/api", login);
app.use("/uber-eats/api", register);
app.use("/uber-eats/api", dishes);
app.use("/uber-eats/api", imageUpload);
app.use("/uber-eats/api",profile);
app.use("/uber-eats/api",restaurant);
app.use("/uber-eats/api",personalization);
app.use("/uber-eats/api",deliveryaddress);
app.use("/uber-eats/api",orders);

app.use(session({
    secret              : 'cmpe273_uber_eats',
    resave              : false, // Forces the session to be saved back to the session store, even if the session was never modified during the request
    saveUninitialized   : false, // Force to save uninitialized session to db. A session is uninitialized when it is new but not modified.
    duration            : 60 * 60 * 1000,    // Overall duration of Session : 30 minutes : 1800 seconds
    activeDuration      :  5 * 60 * 1000
}));


app.get("/", function(req,resp){
    resp.send("Uber Eats Server Endpoints");
});

app.listen(3001, function () {
    console.log("Server listening on port 3001");
});

module.exports = app;
