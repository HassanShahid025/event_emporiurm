import React from "react";
import style from "./chart.module.scss";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card } from "../card/Card";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { IOrder } from "../../types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: false,
      text: "Chart.js Bar Chart",
    },
  },
};

const Chart = () => {
  const { products  } = useSelector((store: RootState) => store.product);

  console.log(products)

  //Create a new array for order status
  const array: string[] = [];
  products.map((item) => array.push(item.category!));

  const getAdCategoryCount = (arr: string[], value: String) => {
    return arr.filter((item) => item === value).length;
  };

  const Venue = getAdCategoryCount(array, "Venue");
  const Decoration = getAdCategoryCount(array, "Decoration");
  const Photography = getAdCategoryCount(array, "Photography");
  const Food = getAdCategoryCount(array, "Food Catering");

  const data = {
    labels: ["Venue", "Decoration", "Photography", "Food Catering"],
    datasets: [
      {
        label: "Order count",
        data: [Venue, Decoration, Photography, Food],
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <div className={style.charts}>
      <Card cardClass={style.card}>
        <h3>Order Status Chart</h3>
        <Bar options={options} data={data} />;
      </Card>
    </div>
  );
};

export default Chart;
