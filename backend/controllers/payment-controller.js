import Stripe from "stripe"
import dotenv from "dotenv"
import User from "../models/user-model.js";
dotenv.config()
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const paymentController = {}

paymentController.createCheckoutSession = async (req, res) => {
    try {
      const { plan } = req.body; // Plan: "basic" or "premium"
      const userId = req.currentUser.id; // User from auth middleware
  
      console.log(plan);
      
      const user = await User.findById(userId)
      const priceIds = {
        basic: "price_1QsOPeCAuzyXYsf5Hn1yPcV4", // Replace with Stripe Price ID
        premium: "price_1QsOTNCAuzyXYsf5O5yVbZp4",
      };
  
      if (!priceIds[plan]) {
        return res.status(400).json({ message: "Invalid plan selected" });
      }
  
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: user.email,
        line_items: [
          {
            price: priceIds[plan],
            quantity: 1,
          },
        ],
        success_url: 'http://localhost:3000/success',
        cancel_url: 'http://localhost:3000/cancel',
      });
  
      res.json({ sessionUrl: session.url ,plan });
    } catch (error) {
      console.error("Stripe error:", error);
      res.status(500).json({ message: "Error creating checkout session" });
    }
  };

 /*  paymentController.success = async (req, res) => {
    const sig = req.headers["stripe-signature"];

    try {
        const event = stripeInstance.webhooks.constructEvent(
            req.body, // Use `req.body` instead of `req.rawBody`
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        let user = null;
        let updatedPlan = "free";
        let updatedStatus = "inactive";

        if (event.type === "checkout.session.completed") {
            const session = event.data.object;
            const userId = session.metadata?.userId;
            const plan = session.metadata?.plan;
            const stripeCustomerId = session.customer;
            const stripeSubscriptionId = session.subscription;

            if (userId) {
                user = await User.findById(userId);
                
                if (user && user.role === "admin") {
                    user.subscription.plan = plan;
                    user.subscription.status = "active";
                    user.subscription.stripeCustomerId = stripeCustomerId;
                    user.subscription.stripeSubscriptionId = stripeSubscriptionId;
                    await user.save();

                    updatedPlan = user.subscription.plan;
                    updatedStatus = user.subscription.status;

                    console.log(`✅ Admin ${userId} upgraded to ${plan} plan`);
                }
            }
        } else if (event.type === "customer.subscription.deleted") {
            const subscription = event.data.object;
            user = await User.findOne({ "subscription.stripeSubscriptionId": subscription.id });

            if (user && user.role === "admin") {
                user.subscription.plan = "free"; // Downgrade to free plan
                user.subscription.status = "canceled";
                user.subscription.stripeSubscriptionId = null;
                await user.save();

                updatedPlan = user.subscription.plan;
                updatedStatus = user.subscription.status;

                console.log(`❌ Admin ${user._id} subscription canceled`);
            }
        }

        res.json({ received: true, plan: updatedPlan, status: updatedStatus });

    } catch (err) {
        console.error("🚨 Webhook Error:", err.message);
        res.status(400).json({ error: `Webhook error: ${err.message}` });
    }
};
 */

paymentController.success = async (req, res) => {
    try {
        const userId = req.currentUser.id // Assuming authentication middleware sets `req.user`
        
        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
            return res.status(404).json({ error: "User not found or unauthorized" });
        }

        // Fetch latest subscription from Stripe
        const subscriptions = await stripe.subscriptions.list({
            customer: user.subscription.stripeCustomerId,
            status: "active",
        });


        console.log(stripe.subscriptions);
        
        if (subscriptions.data.length > 0) {
            user.subscription.plan = subscriptions.data[0].metadata?.plan || "free";
            user.subscription.status = "active";
        } else {
            user.subscription.plan = "free";
            user.subscription.status = "canceled";
        }

        await user.save();
        return res.json({ plan: user.subscription.plan, status: user.subscription.status });
    } catch (err) {
        console.error("🚨 Error in success endpoint:", err.message);
        res.status(500).json({ error: "Failed to verify subscription" });
    }
};


paymentController.fetchSubscriptionStatus = async (req, res) => {
        try {
            const userId = req.currentUser.id; // Assuming user ID is available from auth middleware
            const user = await User.findById(userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.json({
                plan: user.subscription.plan || "free",
                status: user.subscription.status || "inactive",
            });
        } catch (error) {
            console.error("Error fetching subscription status:", error);
            res.status(500).json({ message: "Failed to fetch subscription status" });
        }
    }



export default paymentController