const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const stripe = require("stripe")(process.env.STRIPE_KEY);
const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.get("/", (req, res) => {
    res.status(200).json({ msg: "success" });
});

app.post("/payment/create", async (request, response) => {
    const total = request.query.total;
    if (total > 0) {
        console.log("Payment Request Received for this amount >>> ", total);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: total, // subunits of the currency
            currency: "usd",
        });

        // OK - Created
        console.log(paymentIntent);
        response.status(201).send({
            clientSecret: paymentIntent.client_secret,
        });
    } else {
        response.status(404).json({ msg: "total must be greater than zero" });
    }
});

app.listen(5000, (err) => {
    if (err) throw err;
    console.log("Amazon Server Running on PORT: 5000, http://localhost:5000");
});
