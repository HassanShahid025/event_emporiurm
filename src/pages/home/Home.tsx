import React, { useEffect } from "react";
import Slider from "../../components/slider/Slider";
import "./home.scss";
import Product from "../../components/product/Product";

const Home = () => {
  const url = window.location.href

  const scrollToProducts = () => {
    if(url.includes("#products")){
      window.scrollTo({
        top:700,
        behavior:"smooth"
      })
      return
    }
  }

  useEffect(() => {
    scrollToProducts()
  },[url])

  return (
    <div>
      <Slider />
      <Product/>
    </div>
  );
};

export default Home;
