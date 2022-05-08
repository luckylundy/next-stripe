import "../styles/globals.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Navbar, Container } from "react-bootstrap";
import { CartProvider, DebugCart } from "use-shopping-cart";

function MyApp({ Component, pageProps }) {
  return (
    <CartProvider
      mode="payment"
      cartMode="client-only"
      stripe={process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_API_KEY}
      currency="JPY"
      successUrl="http://localhost:3000/success"
      cancelUrl="http://localhost:3000"
    >
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="#home">Hello EC</Navbar.Brand>
        </Container>
      </Navbar>
      <Component {...pageProps} />
      {process.env.NODE_ENV !== "production" ? (
        <div
          style={{
            width: "30%",
            position: "fixed",
            bottom: 50,
            right: 50,
            overflowX: "scroll",
            padding: 20,
            backgroundColor: "#fefefe",
            boxShadow: "0 0 8px gray",
          }}
        >
          <DebugCart
            style={{
              bottom: 0,
            }}
          />
        </div>
      ) : null}
    </CartProvider>
  );
}

export default MyApp;
