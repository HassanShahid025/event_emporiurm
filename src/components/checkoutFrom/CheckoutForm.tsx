import style from "./checkoutFrom.module.scss";
import { Card } from "../card/Card";
import CheckoutSummary from "../checkoutSummary/CheckoutSummary";
import CheckoutPayment from "../checkoutPayment/CheckoutPayment";

const CheckoutForm = () => {
  return (
    <section>
      <h3 className="container">Checkout</h3>
      <div className={`container ${style.checkout}`}>
        <div>
          <Card cardClass={style.card}>
            <CheckoutSummary />
          </Card>
        </div>

        <div>
          <Card cardClass={`${style.card} ${style.pay}`}>
            <CheckoutPayment />
          </Card>
        </div>
      </div>
    </section>
  );
};

export default CheckoutForm;
