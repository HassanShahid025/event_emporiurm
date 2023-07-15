import { doc, getDoc } from "firebase/firestore";
import {useState,useEffect} from "react";
import { db } from "../firebase/config";
import { toast } from "react-toastify";


const useFetchDocument = (collectionName:string,id:string) => {

    const [document,setDocument] = useState<any>(null)
    console.log(id)

    const getDocument = async () => {
      console.log("fetch")
      try {
        const response = await fetch(`http://localhost:3000/${collectionName}/${id}`);
        const jsonData = await response.json();
        setDocument(jsonData);
        console.log(jsonData);
      } catch (error) {
        console.log(error)
      }
    };
  
  

  useEffect(() => {
    getDocument()
  },[id])

  return{
    document
  }
};

export default useFetchDocument;
