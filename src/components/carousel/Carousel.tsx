import React, { useEffect, useState } from "react";
import { Carousel } from "antd";
import ImageGallery from 'react-image-gallery';
import style from './carousle.module.scss'
import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import loaderImg from '../../assets/loadingImg.jpg'



interface ICarousell {
  url: string[];
}

const Carousell = ({ url }: ICarousell) => {
   const [currentSlide, setCurrentSlide] = useState(0);
  const sliderLength = url.length;

  const prevSlide = () => {
    setCurrentSlide((index) => (index !== 0 ? index - 1 : sliderLength - 1));
  };
  const nextSlide = () => {
    setCurrentSlide((index) => (index !== sliderLength - 1 ? index + 1 : 0));
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, []);

//Place loading img until img loading
const [isLoading, setIsLoading] = useState<boolean[]>([]);
const [hasError, setHasError] = useState<boolean[]>([]);
  const [imageSrcArray, setImageSrcArray] = useState<string[]>([...url])

 
  useEffect(() => {
    const loadImages = () => {
      const loadingStatus: boolean[] = [];
      const errorStatus: boolean[] = [];

      const loadImage = (src: string, index: number) => {
        const image = new Image();

        const handleLoad = () => {
          loadingStatus[index] = false;
          setIsLoading([...loadingStatus]);
        };

        const handleError = () => {
          loadingStatus[index] = false;
          errorStatus[index] = true;
          setIsLoading([...loadingStatus]);
          setHasError([...errorStatus]);
        };

        image.onload = handleLoad;
        image.onerror = handleError;
        image.src = src;
      };

      setIsLoading(new Array(imageSrcArray.length).fill(true));
      setHasError(new Array(imageSrcArray.length).fill(false));

      imageSrcArray.forEach((src, index) => {
        loadImage(src, index);
      });
    };

    loadImages();
  }, [imageSrcArray]);

  return (
    <div className={style.slider}>
      <AiOutlineArrowLeft className="arrow prev" onClick={prevSlide} />
      <AiOutlineArrowRight className="arrow next" onClick={nextSlide} />
      {url.map((slide, index) => {

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
            
            {isLoading[index] && <img src={loaderImg} alt="Placeholder Image" />}
          {!isLoading[index] && !hasError[index] && (
            <img src={slide} alt="Actual Image" />
          )}
                
           
          </article>
        );
      })}
    </div>
  );
 

  //     <img src={url[1]} style={contentStyle} className="check"/>

  //     <img src={url[2]} style={contentStyle} className="check"/>

  //     <img src={url[3]} style={contentStyle} className="check"/>
  //   </Carousel>
  // );
};

export default Carousell;
