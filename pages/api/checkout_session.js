import Stripe from "stripe";

export default async function handler(req, res) {
  //リクエストがPOST以外ならエラーを返す
  if (req.method.toLocaleLowerCase() !== "post") {
    return res.status(405).end();
  }
  try {
    const { price, quantity, items } = req.body;
    const lineItems = items
      ? items.map((item) => ({
          price: item.id,
          quantity: item.quantity,
          adjustable_quantity: {
            enabled: true,
          },
        }))
      : [
          {
            price,
            quantity,
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
              maximum: 10,
            },
          },
        ];
    const stripe = new Stripe(process.env.STRIPE_API_KEY, {
      apiVersion: "2020-08-27",
      maxNetworkRetries: 3,
    });
    //Stripeのsessionに必要な情報を作成してsessionに代入
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: "http://localhost:3000/success",
      cancel_url: "http://localhost:3000/",
    });
    if (!items) return res.redirect(301, session.url);
    res.status(200).json({
      url: session.url,
    });
  } catch (e) {
    console.log(e);
    res.status(e.statusCode || 500).json({
      message: e.message,
    });
  }
}
