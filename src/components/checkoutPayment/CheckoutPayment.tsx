import { useState, useEffect } from "react";
import style from "./checkoutPayment.module.scss";
import cardImg from "../../assets/card_img.png";
import { CountryDropdown } from "react-country-region-selector";
import { useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { ICard } from "../../types";
import { current } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { db } from "../../firebase/config";
import { clear_cart } from "../../redux/features/cartSlice";
import { toast } from "react-toastify";

const initialCardData = {
  name: "",
  cardNumber: "",
  expiration: "",
  cvc: "",
  country: "",
  zip: "",
};

const CheckoutPayment = () => {
  const [isCardVisible, setIsCardVisible] = useState(false);
  const [paymentOption, setPaymentOption] = useState("");
  const [card, setCard] = useState({ ...initialCardData });
  const [isExpiry, setIsExpiry] = useState(false);

  const {email,userId} = useSelector((store:RootState) => store.auth)
  const {cartItems,cartTotalAmount} = useSelector((store:RootState) => store.cart)
  const {shippingAddress} = useSelector((store:RootState) => store.checkout)

  const navigate = useNavigate();
  const dispatch = useDispatch()

  const handlePaymentOptionChange = (e: any) => {
    setPaymentOption(e.target.value);
    setIsCardVisible(e.target.value === "card");
    if (e.target.value === "cash") {
      setCard({ ...initialCardData });
    }
  };

  const handleCard = (e: any) => {
    let { name, value } = e.target;

    if (name === "cardNumber") {
      const outputString = value.replace(/(\d{4})|[^0-9]/g, (match:any, group1:any) => {
        if (group1) {
          return group1 + " "; // Add a space after every four digits
        } else {
          return ""; // Remove non-digit characters
        }
      });
      setCard({ ...card, [name]: outputString });
    }
    else if(name ==="cvc" || name === "zip"){
      console.log("gdfggf")
      value = value.replace(/[^0-9]/g, "")
      setCard({ ...card, [name]: value });
    }
    else {
      setCard({ ...card, [name]: value });
    }
  };

  const date = new Date();

  const checkExpiry = () => {
    if (card.expiration.length === 5) {
      const currentYear = parseInt(date.getFullYear().toString().slice(2, 5));
      const cardExpiryYear = parseInt(card.expiration.slice(3, 6));
      if (cardExpiryYear < currentYear) {
        setIsExpiry(true);
      } else if (cardExpiryYear > currentYear) {
        setIsExpiry(false);
      } else if (cardExpiryYear === currentYear) {
        const currentMonth = parseInt(date.getMonth().toString().slice(0, 2));
        const cardExpiryMonth = parseInt(card.expiration.slice(0, 2));
        if (cardExpiryMonth <= currentMonth) {
          setIsExpiry(true);
        } else if (cardExpiryMonth > currentMonth) {
          setIsExpiry(false);
        }
      }
    }
  };
  useEffect(() => {
    checkExpiry();
  }, [card.expiration]);

  const disableButton = () => {
    if (paymentOption === "") {
      return true;
    }
    if (paymentOption === "card") {
      if (
        card.cardNumber.length !== 20 ||
        card.zip.length !== 5 ||
        card.country === "" ||
        card.expiration.length !== 5 ||
        card.name === "" ||
        card.cvc.length !== 3 ||
        isExpiry === true
      ) {
        return true;
      }
    } else {
      return false;
    }
  };


  const formatExpiryInput = (event: any) => {
    const inputChar = String.fromCharCode(event.keyCode);
    const code = event.keyCode;
    const allowedKeys = [8];
    if (allowedKeys.indexOf(code) !== -1) {
      return;
    }

    event.target.value = event.target.value
      .replace(
        /^([1-9]\/|[2-9])$/g,
        "0$1/" // 3 > 03/
      )
      .replace(
        /^(0[1-9]|1[0-2])$/g,
        "$1/" // 11 > 11/
      )
      .replace(
        /^([0-1])([3-9])$/g,
        "0$1/$2" // 13 > 01/3
      )
      .replace(
        /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
        "$1/$2" // 141 > 01/41
      )
      .replace(
        /^([0]+)\/|[0]+$/g,
        "0" // 0/ > 0 and 00 > 0
      )
      .replace(
        /[^\d\/]|^[\/]*$/g,
        "" // To allow only digits and `/`
      )
      .replace(
        /\/\//g,
        "/" // Prevent entering more than 1 `/`
      );
      setCard({...card, expiration:event.target.value})
  };

  const handleSubmit = () => {
    const today = new Date();
    const date = today.toDateString();
    const time = today.toLocaleTimeString();
    const orderConfig = {
      userId,
      email,
      orderDate:date,
      orderTime:time,
      orderAmount: cartTotalAmount,
      orderStatus:"Order Placed...",
      cartItems,
      shippingAddress,
      createdAt:Timestamp.now().toDate()
    };

    try {
      addDoc(collection(db, "orders"), orderConfig);
      dispatch(clear_cart())
      toast.success("You order has been placed successfully")
      navigate("/checkout-success");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container">
      <h3>Payment Method</h3>
      <div className={style.options}>
        <input
          type="radio"
          name="payment"
          value="cash"
          onChange={handlePaymentOptionChange}
        />
        <label>Cash on delivery</label>
      </div>
      <div className={style.options}>
        <input
          type="radio"
          name="payment"
          value="card"
          onChange={handlePaymentOptionChange}
        />
        <label>Debit/Credit</label>
      </div>

      <div className={style.inputBox}>
        <span>cards accepted :</span>
        <img src={cardImg} alt="card" />
      </div>

  
      <div className={style.inputBox}>
        <span>Name on card</span>
        <input
          name="name"
          type="text"
          placeholder="John Deo"
          disabled={!isCardVisible}
          value={card.name}
          onChange={(e) => handleCard(e)}
        />
      </div>
      <div className={style.inputBox}>
        <span>Card number</span>
        <input
          name="cardNumber"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          placeholder="1234 1234 1234 1234"
          disabled={!isCardVisible}
          value={card.cardNumber}
          onChange={(e) => handleCard(e)}
          maxLength={19}
          minLength={19}
        />
      </div>

      <div className={style.flex}>
        <div className={style.inputBox}>
          <span>Expiration</span>
          <input
            maxLength={5}
            placeholder="MM/YY"
            type="text"
            value={card.expiration}
            onChange={formatExpiryInput}
            disabled={!isCardVisible}
          />
          {isExpiry && <p style={{ color: "red" }}>Your card is expired</p>}
        </div>
        <div className={style.inputBox}>
          <span>CVC</span>
          <input
            type="text"
            name="cvc"
            placeholder="024"
            disabled={!isCardVisible}
            value={card.cvc}
            onChange={(e) => handleCard(e)}
            maxLength={3}
          />
        </div>
      </div>

      <div className={style.flex}>
        <div className={style.inputBox}>
          <span>Country</span>
          <CountryDropdown
            disabled={!isCardVisible}
            classes={style.select}
            valueType="short"
            value={card.country}
            onChange={(val) =>
              handleCard({
                target: {
                  name: "country",
                  value: val,
                },
              })
            }
          />
        </div>
        <div className={style.inputBox}>
          <span>ZIP</span>
          <input
            type="text"
            name="zip"
            placeholder="90210"
            disabled={!isCardVisible}
            value={card.zip}
            onChange={(e) => handleCard(e)}
            maxLength={5}
          />
        </div>
      </div>

      <button
        className={`--btn --btn-primary ${style.checkoutBtn}`}
        onClick={handleSubmit}
        disabled={disableButton()}
      >
        Checkout
      </button>
      <div></div>
    </div>
  );
};

export default CheckoutPayment;
