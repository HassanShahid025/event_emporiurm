import React from "react";
import { Carousel } from "antd";

const contentStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
  minHeight: "100%",
  objectFit: "cover",
};

interface ICarousell {
  url: string[];
}

const Carousell = ({ url }: ICarousell) => {
  const onChange = (currentSlide: number) => {
    console.log(currentSlide);
  };
  console.log(url[0]);
  return (
    <Carousel afterChange={onChange} style={{ backgroundColor: "red", }}>
      <img src={url[0]} className="check" />

      <img src={url[1]} style={contentStyle} className="check"/>

      <img src={url[2]} style={contentStyle} className="check"/>

      <img src={url[3]} style={contentStyle} className="check"/>
    </Carousel>
  );
};

export default Carousell;
