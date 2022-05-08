import { Stack, Card, ButtonGroup, Button } from "react-bootstrap";
import { useShoppingCart } from "use-shopping-cart";

export function CartDetail() {
  const {
    cartDetails,
    removeItem,
    formattedTotalPrice,
    clearCart,
    redirectToCheckout,
    cartCount,
  } = useShoppingCart();

  return (
    <Stack gap={1}>
      {Object.entries(cartDetails).map(([priceId, detail]) => {
        return (
          <Card key={priceId}>
            <Card.Body>
              <Card.Title>{detail.name}</Card.Title>
              <Card.Text>
                {detail.formattedPrice} * {detail.quantity} ={" "}
                {detail.formattedValue} {detail.currency}
              </Card.Text>
              <ButtonGroup>
                <Button
                  variant="outline-danger"
                  onClick={() => removeItem(priceId)}
                >
                  削除
                </Button>
              </ButtonGroup>
            </Card.Body>
          </Card>
        );
      })}
      <Card>
        <Card.Header>合計</Card.Header>
        <Card.Body>
          <Card.Title>{formattedTotalPrice}</Card.Title>
          <ButtonGroup>
            <Button
              variant="primary"
              disabled={cartCount < 1}
              onClick={async () => {
                try {
                  const session = await fetch(
                    "http://localhost:3000/api/checkout_session",
                    {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        items: Object.entries(cartDetails).map(
                          ([_id, detail]) => ({
                            id: detail.id,
                            quantity: detail.quantity,
                          })
                        ),
                      }),
                    }
                  ).then((response) => response.json());
                  window.open(session.url);
                } catch (e) {
                  window.alert(e.message);
                }
              }}
            >
              注文する
            </Button>
            <Button variant="outline-danger" onClick={() => clearCart()}>
              カートを空にする
            </Button>
          </ButtonGroup>
        </Card.Body>
      </Card>
    </Stack>
  );
}
