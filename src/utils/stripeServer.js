// source: https://github.com/tmarek-stripe/demo-react-stripe-js/blob/2859ace16901484a0275c11ffa753d326a5b52ec/pages/api/payment_intents.js

// const Stripe = require("stripe");

// require("dotenv").config({ debug: process.env.DEBUG });

debugger;

const stripe = require("stripe")("sk_test_vxUXiJziuwIDOcb28O9zeSnd00tPWspgxm");

// export default async (req, res) => {
//   if (req.method === "POST") {
//     try {
//       const { amount } = req.body;
//       // Psst. For production-ready applications we recommend not using the
//       // amount directly from the client without verifying it first. This is to
//       // prevent bad actors from changing the total amount on the client before
//       // it gets sent to the server. A good approach is to send the quantity of
//       // a uniquely identifiable product and calculate the total price server-side.
//       // Then, you would only fulfill orders using the quantity you charged for.

//       const paymentIntent = await stripe.paymentIntents.create({
//         amount,
//         currency: "usd",
//       });

//       res.status(200).send(paymentIntent.client_secret);
//     } catch (err) {
//       res.status(500).json({ statusCode: 500, message: err.message });
//     }
//   } else {
//     res.setHeader("Allow", "POST");
//     res.status(405).end("Method Not Allowed");
//   }
// };

// change to quantity
const createPaymentIntent = async (amount) => {
  // check amount for security
  // console.log("stripeServer amount ", amount);
  // if (amount !== 5000) return null;
  // somehow try doesn't work here, paymentIntent gets passed as undefined
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });
    return paymentIntent;
  } catch (error) {
    // console.log("error: ", error);
    // return "error: " + error;
  }

  // console.log("paymentIntent ", paymentIntent);

  // // add status to response?  would need to update resolver
  // return paymentIntent;
};

module.exports.createPaymentIntent = createPaymentIntent;
