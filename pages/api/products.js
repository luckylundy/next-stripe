import Stripe from "stripe";

export default async function handler(req, res) {
  // GET以外のリクエストは終了させる
  if (req.method.toLocaleLowerCase() !== "get") {
    return res.status(405).end();
  }
  const stripe = new Stripe(process.env.STRIPE_API_KEY, {
    //StripeのAPIバージョンを指定
    apiVersion: "2020-08-27",
    //ネットワークエラーでStripe API呼び出しが失敗した時のリトライ回数を指定
    maxNetworkRetries: 3,
  });
  //Stripeのアカウント内の商品一覧を取得する
  const products = await stripe.products.list();
  //商品データが空だった場合、空の配列を返す
  if (!products.data || products.data.length < 1) {
    return res.status(200).json([]);
  }
  const response = await Promise.all(
    //商品と料金を紐づける
    products.data.map(async (product, i) => {
      const prices = await stripe.prices.list({
        product: product.id,
      });
      //必要なデータを指定して返す
      return {
        id: product.id,
        description: product.description,
        name: product.name,
        images: product.images,
        unit_label: product.unit_label,
        prices: prices.data.map((price) => {
          return {
            id: price.id,
            currency: price.currency,
            transform_quantity: price.transform_quantity,
            unit_amount: price.unit_amount,
          };
        }),
      };
    })
  );
  //取得した商品一覧をJSON形式で返す
  res.status(200).json(response);
}
