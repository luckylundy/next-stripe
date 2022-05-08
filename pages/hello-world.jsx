import Head from "next/head";

export default function HelloWorld(props) {
  return (
    <div>
      <Head>
        <title>Lucky Lundy</title>
        <meta name="description" content="検索エンジン用の説明文" />
      </Head>
      <h1>Hello World</h1>
      <pre>
        <code>{JSON.stringify(props, null, 2)}</code>
      </pre>
    </div>
  );
}

export async function getServerSideProps(context) {
  try {
    //データを取得するURLを決定する
    const host = context.req.headers.host || "localhost:3000";
    const protocol = /^localhost/.test(host) ? "http" : "https";
    const products = await fetch(`${protocol}://${host}/api/products`).then(
      (data) => data.json()
    );
    //pages/api/productsから取得したデータをprops: {products: {}}の形で展開する
    return {
      props: {
        products,
      },
    };
  } catch (e) {
    console.log(e);
    return {
      props: {
        products: [],
      },
    };
  }
}
