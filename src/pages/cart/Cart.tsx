import { useSelector } from "react-redux";
import style from "./cart.module.scss";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { IProducts } from "../../types";
import { FaTrashAlt } from "react-icons/fa";
import { Card } from "../../components/card/Card";
import { useDispatch } from "react-redux";
import {
  add_to_cart,
  calculate_CartTotalQuantity,
  calculate_cartTotalAmount,
  clear_cart,
  decrease_cart,
  remove_from_cart,
  save_url,
} from "../../redux/features/cartSlice";
import Notiflix from "notiflix";
import { useEffect } from "react";

const Cart = () => {
  const { cartItems, cartTotalAmount, cartTotalQuantity } = useSelector(
    (store: RootState) => store.cart
  );
  const { isLoggedIn } = useSelector((store: RootState) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const increaseCart = (cart: IProducts) => {
    dispatch(add_to_cart({ product: cart }));
  };
  const decreaseCart = (cart: IProducts) => {
    dispatch(decrease_cart({ product: cart }));
  };

  const deleteCartItem = (cart: IProducts) => {
    Notiflix.Confirm.show(
      "Remove Product",
      "You are about to remove this product from cart?",
      "Remove",
      "Cancel",
      function okCb() {
        dispatch(remove_from_cart({ product: cart }));
      },
      function cancelCb() {
        console.log("cancel");
      },
      {
        width: "320px",
        borderRadius: "8px",
        titleColor: "#f7c17b",
        okButtonBackground: "#f7c17b",
        cssAnimationStyle: "zoom",
      }
    );
  };

  const clearCart = () => {
    Notiflix.Confirm.show(
      "Clear Cart",
      "You are about to clear the cart?",
      "Clear",
      "Cancel",
      function okCb() {
        dispatch(clear_cart());
      },
      function cancelCb() {
        console.log("cancel");
      },
      {
        width: "320px",
        borderRadius: "8px",
        titleColor: "#f7c17b",
        okButtonBackground: "#f7c17b",
        cssAnimationStyle: "zoom",
      }
    );
  };

  useEffect(() => {
    dispatch(calculate_cartTotalAmount());
    dispatch(calculate_CartTotalQuantity());
    dispatch(save_url(""));
  }, [cartItems]);

  const url = window.location.href;

  const checkout = () => {
    if (isLoggedIn) {
      navigate("/checkout-details");
    } else {
      dispatch(save_url(url));
      navigate("/login");
    }
  };

  return (
    <section>
      <div className={`container ${style.table}`}>
        <h2>Shopping Cart</h2>
        {cartItems.length === 0 ? (
          <>
            <p>Your cart is currently empty.</p>
            <br />
            <div>
              <Link to="/#products">&larr; Continue shopping</Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Products</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cart: IProducts, index: number) => {
                  const { id, name, price, imageURL, cartQuantiy } = cart;
                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <img
                          src={imageURL}
                          alt={name}
                          style={{ width: "100px" }}
                        />
                      </td>
                      <td>{price}</td>
                      <td>
                        <div className={style.count}>
                          <button
                            className="--btn"
                            onClick={() => decreaseCart(cart)}
                          >
                            -
                          </button>
                          <p>
                            <b>{cartQuantiy}</b>
                          </p>
                          <button
                            className="--btn"
                            onClick={() => increaseCart(cart)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td>{(price! * cartQuantiy!).toFixed(2)}</td>
                      <td className={style.icons}>
                        <FaTrashAlt
                          size={18}
                          color="red"
                          onClick={() => deleteCartItem(cart)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={style.summary}>
              <button className="--btn --btn-danger" onClick={clearCart}>
                Clear Cart
              </button>
              <div className={style.checkout}>
                <div>
                  <Link to="/#products">Continue shopping</Link>
                </div>
                <br />
                <Card cardClass={style.card}>
                  <p>
                    Cart items(s): <b>{cartTotalQuantity}</b>
                  </p>
                  <div className={style.text}>
                    <h4>Subtotal:</h4>
                    <h3>{`$${cartTotalAmount.toFixed(2)}`}</h3>
                  </div>
                  <p>Taxes and shipping calculated at checkout</p>
                  <button
                    className="--btn --btn-primary --btn-block"
                    onClick={checkout}
                  >
                    Checkout
                  </button>
                </Card>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
