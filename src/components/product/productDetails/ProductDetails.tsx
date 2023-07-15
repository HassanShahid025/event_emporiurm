import { useEffect, useState } from "react";
import style from "./ProductDetails.module.scss";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebase/config";
import { IProducts } from "../../../types";
import { toast } from "react-toastify";
import spinnerImg from "../../../assets/spinner.jpg";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useFetchDocument from "../../../customHooks/useFetchDocument";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import { Card } from "../../card/Card";
import StarsRating from "react-star-rate";
import Carousell from "../../carousel/Carousel";
import { toggle_favourite } from "../../../redux/features/cartSlice";
import { FiExternalLink } from "react-icons/fi";
import Notiflix from "notiflix";
import { addPrevURL } from "../../../redux/features/authSlice";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProducts | null>(null);

  const { document } = useFetchDocument("ads", id!);


  useEffect(() => {
    setProduct(document);
    
  }, [document]);

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation();

  const { cartItems } = useSelector((store: RootState) => store.cart);
  const { isLoggedIn } = useSelector((store: RootState) => store.auth);
  const { data } = useFetchCollection("reviews");
  const filteredReviews = data.filter((review) => review.productID == id);

  const cart = cartItems.find((cart) => cart.ad_id === id);


  // const decreaseCart = (cart: IProducts) => {
  //   dispatch(decrease_cart({ product: cart }));
  //   dispatch(calculate_CartTotalQuantity());
  // };

  // const addToCart = (product: IProducts) => {
  //   dispatch(add_to_cart({ product }));
  //   dispatch(calculate_CartTotalQuantity());
  // };

  const toggleFavourite = () => {
    dispatch(toggle_favourite({ product }));
  };

  const checkLogin = () => {
    if (isLoggedIn) {
      toggleFavourite();
    } else {
      Notiflix.Confirm.show(
        "Login",
        "Login to add to favourites",
        "Login",
        "Cancel",
        function okCb() {
          navigate("/login");
          dispatch(addPrevURL({ product, url: location.pathname }));
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
    }
  };


  return (
    <section>
      <div className={`container ${style.product}`}>
        <h2>Ad Details</h2>
        <div>
          <Link to="/#products">&larr; Back to Ads</Link>
        </div>
        {product === null ? (
          <img src={spinnerImg} alt="Loading.." style={{ width: "50px" }} />
        ) : (
          <>
            <div className={style.details}>
              <div className={style.img}>
                <Carousell url={product.images!} />
                {/* <img src={product.imageURL} alt={product.name} /> */}
              </div>
              <div className={style.content}>
                <h3>{product.name}</h3>
                <p className={style.price}>{`Rs: ${product.price}`}</p>
                <p>{product.ad_desc}</p>
                <p>
                  <b>SKU:</b> {product.ad_id}
                </p>
                <p>
                  <b>City:</b> {product.city}
                </p>
                <p>
                  <b>Category:</b> {product.category}
                </p>
                {product.venue_category !== "" && (
                  <p>
                  <b>Venue Category:</b> {product.venue_category}
                </p>
                )}
                <p>
                  <b>Location</b>{" "}
                  <a href={product.location} target="_blank">
                    View on Google maps <FiExternalLink />
                  </a>
                </p>
                {/* {cart && (
                  <div className={style.count}>
                    <button
                      className="--btn"
                      // onClick={() => decreaseCart(product)}
                    >
                      -
                    </button>
                    <p>
                      <b>{cart?.cartQuantiy}</b>
                    </p>
                    <button
                      className="--btn"
                      // onClick={() => addToCart(product)}
                    >
                      +
                    </button>
                  </div>
                )} */}
                <button
                  className="--btn --btn-danger"
                  onClick={() => checkLogin()}
                >
                  {cart ? "REMOVE FROM FAVOURITES" : "ADD TO FAVOURITES"}
                </button>
              </div>
            </div>
          </>
        )}
        <h3>Venue Reviews</h3>
        <div>
          {filteredReviews.length === 0 ? (
            <p>There are no reviews for this product yet</p>
          ) : (
            <>
              <Card cardClass={style.card}>
                {filteredReviews.map((item, index) => {
                  const { rate, review, reviewDate, userName } = item;
                  return (
                    <div className={style.review} key={index}>
                      <StarsRating value={rate} />
                      <p>{review}</p>
                      <span>
                        <b>{reviewDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>By: {userName}</b>
                      </span>
                    </div>
                  );
                })}
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProductDetails;
