import { useEffect, useState } from "react";
import "./slider.scss";
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import { sliderData } from "./sliderData";
import { Link } from "react-router-dom";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderLength = sliderData.length;

  const prevSlide = () => {
    setCurrentSlide((index) => (index !== 0 ? index - 1 : sliderLength - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((index) => (index !== sliderLength - 1 ? index + 1 : 0));
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, []);


    useEffect(() => {
      let slider = setInterval(nextSlide, 3000);
      return () => clearInterval(slider);
    }, [currentSlide]);

  return (
    <div className="slider">
      <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
      <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />
      {sliderData.map((slide, index) => {

        let position = "nextSlide";
        if (index === currentSlide) position = "activeSlide";
        if (
          index === currentSlide - 1 ||
          (currentSlide === 0 && index === sliderLength - 1)
        ) {
          position = "lastSlide";
        }

        return (
          <article
            key={index}
            className={position}
          >
            
                <img src={slide.image} alt="slide" />
                <div className="content">
                  <h2>{slide.heading}</h2>
                  <p>{slide.desc}</p>
                  <hr />
                  <Link to="/#products" className="--btn --btn-primary">
                    Shop Now
                  </Link>
                </div>
             
           
          </article>
        );
      })}
    </div>
  );
};

export default Slider;
