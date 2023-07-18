import { useEffect, useState } from "react";
import style from "./ProductDetails.module.scss";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { IProducts } from "../../../types";
import { toast } from "react-toastify";
import spinnerImg from "../../../assets/spinner.jpg";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import useFetchDocument from "../../../customHooks/useFetchDocument";
import { Card } from "../../card/Card";
import StarsRating from "react-star-rate";
import Carousell from "../../carousel/Carousel";
import { toggle_favourite } from "../../../redux/features/cartSlice";
import { FiExternalLink } from "react-icons/fi";
import Notiflix from "notiflix";
import { addPrevURL } from "../../../redux/features/authSlice";
import ReviewProduct from "../../reviewProduct/ReviewProduct";
import ComplainModal from "../../complainModal/ComplainModal";

import AdBookings from "./AdBookings";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<IProducts | null>(null);
  const [bookingDates, setBookingDates] = useState<any[]>([]);

  const { document } = useFetchDocument("ads", id!);

  useEffect(() => {
    setProduct(document);
  }, [document]);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { cartItems } = useSelector((store: RootState) => store.cart);
  const { isLoggedIn, user } = useSelector(
    (store: RootState) => store.auth.auth
  );
  const [adReviews, setAdReviews] = useState<any[]>([]);

  const cart = cartItems.find((cart) => cart.ad_id === id);
  console.log(user);

  const getReviews = async () => {
    try {
      const user_id = user.user_id;
      const response = await fetch(`http://localhost:3000/reviews/${id}`);
      const jsonData = await response.json();
      setAdReviews(jsonData);
      console.log(jsonData);
    } catch (error) {
      toast.error("error occured");
    }
  };

  const getBookings = async () => {
    const ad_id = id;
    try {
      const response = await fetch(`http://localhost:3000/bookings/${ad_id}`);
      const jsonData = await response.json();
      const convertedDates = (jsonData.booking_dates as string[]).map(
        (date) => new Date(date).toISOString().split("T")[0]
      );
      console.log(convertedDates);
      console.log(jsonData);
      setBookingDates(convertedDates);
    } catch (error) {
      console.log("error occured");
    }
  };

  useEffect(() => {
    getReviews();
    getBookings()
  }, []);

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

  console.log(product?.user_id)

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
                <div className={style.flex}>
                <p className={style.price}>{`Rs: ${product.price}`}</p>
                <span >
                  <p className={style.price}>Bookings:</p>
                <AdBookings bookingDates={bookingDates}/>
                </span>
                </div>
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
                <button
                  className="--btn --btn-danger"
                  onClick={() => checkLogin()}
                >
                  {cart ? "REMOVE FROM FAVOURITES" : "ADD TO FAVOURITES"}
                </button>
                {isLoggedIn ? (
                  <ComplainModal name={product.name!} />
                ) : (
                  <button
                    className={style.btn}
                    onClick={() => toast.error("Login to report ad")}
                  >
                    Report AD
                  </button>
                )}
              </div>
              
            </div>
          </>
        )}
        <h3>Venue Reviews</h3>
        <div>
          {adReviews === null || adReviews.length === 0 ? (
            <p>There are no reviews for this product yet</p>
          ) : (
            <>
              <Card cardClass={style.card}>
                {adReviews.map((item: any, index: any) => {
                  const { rating, review_text, review_date, first_name } = item;
                  const date = new Date(review_date);
                  const formattedDate = date.toLocaleDateString("en-GB");
                  return (
                    <div className={style.review} key={index}>
                      <StarsRating value={rating} />
                      <p>{review_text}</p>
                      <span>
                        <b>{formattedDate}</b>
                      </span>
                      <br />
                      <span>
                        <b>By: {first_name}</b>
                      </span>
                    </div>
                  );
                })}
              </Card>
            </>
          )}
        </div>
        {isLoggedIn && product?.user_id != user.user_id ? <ReviewProduct setAdReviews={setAdReviews} /> : null}
      </div>
    </section>
  );
};

export default ProductDetails;
