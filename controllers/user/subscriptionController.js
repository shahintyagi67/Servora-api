require('dotenv').config();
const Stripe = require("stripe");
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const CLIENT_URL = "http://localhost:3000";


const createCheckout = async (req, res) => {
    const { planName, amount, userId } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: [
                {
                    price_data: {
                        currency: "usd",
                        product_data: {
                            name: planName,
                        },
                        unit_amount: amount * 100,
                    },
                    quantity: 1,
                },
            ],
            mode: "payment",
            success_url: `${CLIENT_URL}/success?session_id={CHECKOUT_SESSION_ID}&userId=${userId}&planName=${planName}&amount=${amount}`,
            cancel_url: `${CLIENT_URL}/cancel`,
        });

        res.json({ id: session.id, url: session.url });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

const stripeWebhook = async (req, res) => {
    let event;
    try {
        const payload = req.body;
        const sig = req.headers['stripe-signature'];
        event = stripe.webhooks.constructEvent(payload, sig, "whsec_4e3f43ddf8af03649a62f116e3bb93e134115c490335761a071f32cfb36c1098"); 
    } catch (err) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Extract params from success URL
        const userId = new URL(session.success_url).searchParams.get("userId");
        const planName = new URL(session.success_url).searchParams.get("planName");
        const amount = new URL(session.success_url).searchParams.get("amount");

        // Save subscription in DB
        const startDate = new Date();
        const endDate = new Date();
        endDate.setMonth(endDate.getMonth() + 1); // 1 month validity

        await Subscription.create({
            userId,
            planName,
            amount,
            startDate,
            endDate,
            status: "active",
            paymentId: session.payment_intent
        });
    }

    res.json({ received: true });
}

module.exports = {createCheckout, stripeWebhook}