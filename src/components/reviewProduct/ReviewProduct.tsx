import React, { useEffect, useState } from "react";
import style from "./reviewProduct.module.scss";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Card } from "../card/Card";
import StarsRating from "react-star-rate";
import { toast } from "react-toastify";
import useFetchDocument from "../../customHooks/useFetchDocument";
import { IProducts } from "../../types";

interface IReviews{
  setAdReviews: React.Dispatch<React.SetStateAction<any[]>>
}

const ReviewProduct = ({setAdReviews}:IReviews) => {
  const [rate, setRate] = useState(0);
  const [review, setReview] = useState("");
  const [product, setProduct] = useState<IProducts | null>(null);
  const { id } = useParams();

  const { user } = useSelector((store: RootState) => store.auth.auth);
  const { document } = useFetchDocument("products", id!);
  const [date, setDate] = useState("")

  useEffect(() => {
    const todaydate = new Date();
    const year = String(todaydate.getFullYear());
    const month = String(todaydate.getMonth() + 1).padStart(2, "0");
    const day = String(todaydate.getDate()).padStart(2, "0");
    setDate(`${year}-${month}-${day}`);
  }, []);
  useEffect(() => {
    setProduct(document);
  }, [document]);

  const submitReview = async(e: any) => {
    e.preventDefault();

    try {
      const body = { ad_id:id,user_id:user.user_id,rating:rate,review_text:review,review_date:date,first_name:user.first_name };
      const response = await fetch(`http://localhost:3000/reviews-add/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setRate(0);
      setReview("")
      getReviews()
      toast.success("Review submitted")
    } catch (error) {
      toast.error("Error occured");
      ;
    }
  };

  const getReviews = async () => {
    try {
      const response = await fetch(`http://localhost:3000/reviews/${id}`);
      const jsonData = await response.json();
      setAdReviews(jsonData);
      console.log(jsonData);
    } catch (error) {
      toast.error("error occured");
    }
  };


  return (
    <section>
      <div className={`container ${style.review}`}>
        <h2>Review Product</h2>
          <>
            <p>
              <b>Product Name</b> {product?.name}
            </p>
            <img
              src={product?.images![0]}
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
      </div>
    </section>
  );
};

export default ReviewProduct;
