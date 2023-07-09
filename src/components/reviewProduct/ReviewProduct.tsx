import React, { useEffect, useState } from "react";
import style from "./reviewProduct.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { auth, db } from "../../firebase/config";
import { RootState } from "../../redux/store";
import { Card } from "../card/Card";
import StarsRating from "react-star-rate";
import { toast } from "react-toastify";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import useFetchDocument from "../../customHooks/useFetchDocument";
import { IProducts } from "../../types";
import spinnerImg from "../../assets/spinner.jpg";

const ReviewProduct = () => {
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState("");
  const [product, setProduct] = useState<IProducts | null>(null);
  const { id } = useParams();

  const { userId, userName } = useSelector((store: RootState) => store.auth);
  const { products } = useSelector((store: RootState) => store.product);
  const { document } = useFetchDocument("products", id!);
  useEffect(() => {
    setProduct(document);
  }, [document]);

  const submitReview = (e: any) => {
    e.preventDefault();

    const today = new Date();
    const date = today.toDateString();
    const reviewConfig = {
      userId,
      userName,
      productID: id,
      rate,
      review,
      reviewDate: date,
      createdAt: Timestamp.now().toDate(),
    };

    try {
      addDoc(collection(db, "reviews"), reviewConfig);
      toast.success("Review submitted successfully");
      setRate(0);
      setReview("");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <section>
      <div className={`container ${style.review}`}>
        <h2>Review Product</h2>
        {product === null ? (
         <div className="loading-container">
         <img
            src={spinnerImg}
          />
      </div>
        ) : (
          <>
            <p>
              <b>Product Name</b> {product?.name}
            </p>
            <img
              src={product?.imageURL}
              alt={product?.name}
              style={{ width: "100px" }}
            />
            <Card cardClass={style.card}>
              <form onSubmit={(e) => submitReview(e)}>
                <label>Rating:</label>
                <StarsRating value={rate} onChange={(rate) => setRate(rate!)} />
                <label>Review:</label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  cols={30}
                  rows={10}
                  required
                ></textarea>
                <button type="submit" className="--btn --btn-primary">
                  Submit Review
                </button>
              </form>
            </Card>
          </>
        )}
      </div>
    </section>
  );
};

export default ReviewProduct;
