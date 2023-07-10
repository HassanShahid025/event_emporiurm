import { useSelector } from "react-redux";
import style from "./cart.module.scss";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { IProducts } from "../../types";
import { FaTrashAlt } from "react-icons/fa";
import { Card } from "../../components/card/Card";
import { useDispatch } from "react-redux";
import { clear_cart, toggle_favourite } from "../../redux/features/cartSlice";
import Notiflix from "notiflix";
import { useEffect } from "react";

const Cart = () => {
  const { cartItems} = useSelector(
    (store: RootState) => store.cart
  );
  const { isLoggedIn } = useSelector((store: RootState) => store.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const increaseCart = (cart: IProducts) => {
  //   dispatch(add_to_cart({ product: cart }));
  // };
  // const decreaseCart = (cart: IProducts) => {
  //   dispatch(decrease_cart({ product: cart }));
  // };

  const deleteCartItem = (cart: IProducts) => {
    Notiflix.Confirm.show(
      "Remove Venue",
      "You are about to remove this venue from favourites?",
      "Remove",
      "Cancel",
      function okCb() {
        dispatch(toggle_favourite({ product: cart }));
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
      "Clear Favourites",
      "You are about to clear the favourites?",
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

  // useEffect(() => {
  //   dispatch(calculate_cartTotalAmount());
  //   dispatch(calculate_CartTotalQuantity());
  //   dispatch(save_url(""));
  // }, [cartItems]);

  const url = window.location.href;

  // const checkout = () => {
  //   if (isLoggedIn) {
  //     navigate("/checkout-details");
  //   } else {
  //     dispatch(save_url(url));
  //     navigate("/login");
  //   }
  // };

  return (
    <section>
      <div className={`container ${style.table}`}>
        <h2>Favourites</h2>
        {cartItems.length === 0 ? (
          <>
            <p>You have no favourites.</p>
            <br />
            <div>
              <Link to="/#products">&larr; Continue browsing</Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Venues</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((cart: IProducts, index: number) => {
                  const { id, name, price, imageURL, cartQuantiy,category } = cart;
                  return (
                    <tr key={id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <Link to={`/product-details/${id}`}>
                        <img
                          src={imageURL![0]}
                          alt={name}
                          style={{ width: "100px" }}
                        />
                        </Link>
                      </td>
                      <td>{price}</td>
                      <td>
                        {category}
                        {/* <div className={style.count}>
                          <button
                            className="--btn"
                           
                          >
                            -
                          </button>
                          <p>
                            <b>{cartQuantiy}</b>
                          </p>
                          <button
                            className="--btn"
                          
                          >
                            +
                          </button>
                        </div> */}
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
                  <Link to="/#products">Continue Browsing</Link>
                </div>
                <br />
                {/* <Card cardClass={style.card}>
                  <p>
                    Cart items(s): <b>{cartItems.length}</b>
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
                </Card> */}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default Cart;
