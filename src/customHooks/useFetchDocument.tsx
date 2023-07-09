import { doc, getDoc } from "firebase/firestore";
import {useState,useEffect} from "react";
import { db } from "../firebase/config";
import { toast } from "react-toastify";


const useFetchDocument = (collectionName:string,documentID:string) => {

    const [document,setDocument] = useState<any>(null)

  const getDocument = async () => {
    const docRef = doc(db, collectionName, documentID!);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const obj = {
        id: documentID,
        ...docSnap.data(),
      };
      setDocument(obj);
    } else {
      toast.error("Document not found.");
    }
  };

  useEffect(() => {
    getDocument()
  },[])

  return{
    document
  }
};

export default useFetchDocument;
