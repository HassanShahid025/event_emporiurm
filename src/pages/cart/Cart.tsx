import { useSelector } from "react-redux";
import style from "./cart.module.scss";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { IProducts } from "../../types";
import { FaTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clear_cart, toggle_favourite } from "../../redux/features/cartSlice";
import Notiflix from "notiflix";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";


const Cart = () => {
  const { cartItems} = useSelector(
    (store: RootState) => store.cart
  );
  const { user } = useSelector((store: RootState) => store.auth.auth);
  const [fav, setFav] = useState<any>([])

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // const increaseCart = (cart: IProducts) => {
  //   dispatch(add_to_cart({ product: cart }));
  // };
  // const decreaseCart = (cart: IProducts) => {
  //   dispatch(decrease_cart({ product: cart }));
  // };

  const deleteFav = async(favourite_id: string) => {
    try {
      const deleteFav = await fetch(`http://localhost:3000/favourites-remove/${favourite_id}`, {
        method: "DELETE",
      });
      getFav();
      toast.success("Ad removed from favourites")
    } catch (error) {
      toast.error("error occured while removivg")
    }
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


  const getFav = async() => {
    try {
      const response = await fetch(`http://localhost:3000/favourites-ads/${user.user_id}`);
      const jsonData = await response.json();
      setFav(jsonData);
      console.log(jsonData);
    } catch (error) {
      toast.error("Error occured while fetching favourites")
    }
  }

  useEffect(() => {
    getFav()
  },[])

  console.log(fav)

  return (
    <section>
      <div className={`container ${style.table}`}>
        <h2>Favourites</h2>
        {fav.length === 0 ? (
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
                  <th>City</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {fav.map((ad:any, index: number) => {
                  const { favourite_id, ad_id, name, price, images, cartQuantiy,category,city } = ad;
                  return (
                    <tr key={ad_id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <Link to={`/product-details/${ad_id}`}>
                        <img
                          src={images![0]}
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
                      <td>{city}</td>
                      <td className={style.icons}>
                        <FaTrashAlt
                          size={18}
                          color="red"
                          onClick={() => deleteFav(favourite_id)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={style.summary}>
              
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
