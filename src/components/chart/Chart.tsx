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
  const { orderHistory } = useSelector((store: RootState) => store.order);

  //Create a new array for order status
  const array: string[] = [];
  orderHistory.map((item: IOrder) => array.push(item.orderStatus));

  const getOrderStatusCount = (arr: string[], value: String) => {
    return arr.filter((item) => item === value).length;
  };

  const placed = getOrderStatusCount(array, "Processing...");
  const processing = getOrderStatusCount(array, "Shipped...");
  const shipped = getOrderStatusCount(array, "Order Placed...");
  const delivered = getOrderStatusCount(array, "Delivered");

  const data = {
    labels: ["Placed Orders", "Processing", "Shipped", "Delivered"],
    datasets: [
      {
        label: "Order count",
        data: [placed, processing, shipped, delivered],
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
