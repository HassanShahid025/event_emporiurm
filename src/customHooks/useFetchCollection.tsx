import React, { useEffect, useState } from "react";
import { IProducts } from "../types";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../firebase/config";
import { toast } from "react-toastify";
import { Store_Products } from "../redux/features/productSlice";
import { useDispatch } from "react-redux";

const useFetchCollection = (collectionName: string) => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

 
    const getAds = async () => {
      console.log("ads");
      try {
        const response = await fetch(`http://localhost:3000/${collectionName}`);
        const jsonData = await response.json();
        setData(jsonData)
        console.log(jsonData);
        setIsLoading(false)
      } catch (error) {
        console.log(error);
        setIsLoading(false)
      }
    };
  ;

  useEffect(() => {
    getAds();
  }, []);

  return {
    data,
    isLoading,
  };
};

export default useFetchCollection;
