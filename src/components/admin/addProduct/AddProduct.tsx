import { useState } from "react";
import styles from "./addProduct.module.scss";
import { Card } from "../../card/Card";
import { IProducts } from "../../../types";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { db, storage } from "../../../firebase/config";
import { toast } from "react-toastify";
import { Timestamp, addDoc, collection, doc, setDoc } from "firebase/firestore";
import Loader from "../../loader/Loader";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import spinnerImg from "../../../assets/spinner.jpg";

const categories = [
  {
    id: 1,
    name: "Outdoor",
  },
  {
    id: 2,
    name: "Indoor",
  }
];
const cities = [
  {
    id: 1,
    name: "Karachi",
  },
  {
    id: 2,
    name: "Lahore",
  },
  {
    id: 2,
    name: "Islamabad"
  }
];

const initialState = {
  name: "",
  imageURL: [],
  price: 0,
  city: "",
  location: "",
  category: "",
  desc: "",
};

const AddProduct = () => {
  const { id } = useParams();
  const { products } = useSelector((store: RootState) => store.product);
  const productEdit = products.find((item) => item.id === id);

  const [product, setProduct] = useState<IProducts>(() => {
    const newState = detectForm(id!, { ...initialState }, productEdit);
    return newState;
  });

  const [uploadProgress, setUploadProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  function detectForm(id: string, f1: any, f2: any) {
    if (id === "ADD") {
      return f1;
    } else {
      return f2;
    }
  }

  const navigate = useNavigate();

  const editProduct = (e: any) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      setDoc(doc(db, "products", id!), {
        name: product.name,
        imageURL: product.imageURL,
        price: Number(product.price),
        category: product.category,
        desc: product.desc,
        createdAt: productEdit?.createdAt,
        editedAt: Timestamp.now().toDate(),
      });

      // for(let i=0; i<4; i++){
      //   if(!productEdit?.imageURL?.includes(product.imageURL![i])){
      //     const storageRef = ref(storage, productEdit?.imageURL);
      //   deleteObject(storageRef);
      //   }
      // }


      // if (product.imageURL !== productEdit?.imageURL) {
      //   const storageRef = ref(storage, productEdit?.imageURL);
      //   deleteObject(storageRef);
      // }

      setIsLoading(false);
      toast.success("Venue edited successfully.");
      navigate("/admin/all-products");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const handelInputChange= (e: any) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const setImageURL = (downloadURL:string) => {
      setProduct({ ...product, imageURL: [...product.imageURL!, downloadURL] });
  }
  const handelImageChange = (e: any) => {
    const file = e.target.files[0];
    const storageRef = ref(storage, `eshop/${Date.now()}${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast.error(error.message);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageURL(downloadURL)
          toast.success("Image uploaded successfully.");
        });
      }
    );
  };

  const addProduct = (e: any) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const docRef = addDoc(collection(db, "products"), {
        name: product.name,
        imageURL: product.imageURL,
        city: product.city,
        location: product.location,
        price: Number(product.price),
        category: product.category,
        desc: product.desc,
        createdAt: Timestamp.now().toDate().toDateString(),
      });
      setIsLoading(false);
      setProduct(initialState);
      toast.success("Venue added successfully.");
    } catch (error: any) {
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <>
      {isLoading && (
         <img
         src={spinnerImg}
         alt="Loading.."
         style={{ width: "50px" }}
         className="--center-all"
       />
      )}
      <div className={styles.product}>
        <h2>{detectForm(id!, "Add Venue", "Edit Venue")}</h2>
        <Card cardClass={styles.card}>
          <form onSubmit={detectForm(id!, addProduct, editProduct)}>
            <label>Venue name:</label>
            <input
              type="text"
              placeholder="Venue name"
              required
              name="name"
              value={product.name}
              onChange={(e) => handelInputChange(e)}
            />

            <label>Venue images:</label>
            <Card className={styles.group}>
              {uploadProgress === 0 ? null : (
                <div className={styles.progress}>
                  <div
                    className={styles["progress-bar"]}
                    style={{ width: `${uploadProgress}%` }}
                  >
                    {uploadProgress < 100
                      ? `Uploading ${Math.ceil(uploadProgress)}%`
                      : "Image uploaded"}
                  </div>
                </div>
              )}

              <input
                type="file"
                name="image"
                accept="image/*"
                placeholder="Venue Image"
                onChange={(e) => handelImageChange(e)}
              />
              {product.imageURL![0] !== "" ? (
                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.imageURL![0]}
                />
              ) : null}
              {product.imageURL![1] !== "" ? (
                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.imageURL![1]}
                />
              ) : null}
              {product.imageURL![2] !== "" ? (
                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.imageURL![2]}
                />
              ) : null}
              {product.imageURL![3] !== "" ? (
                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.imageURL![3]}
                />
              ) : null}
            </Card>
            <label>Venue price:</label>
            <input
              type="number"
              placeholder="Product price"
              required
              name="price"
              value={product.price}
              onChange={(e) => handelInputChange(e)}
            />
            <label>Venue location:</label>
            <input
              type="text"
              placeholder="Product location"
              required
              name="location"
              value={product.location}
              onChange={(e) => handelInputChange(e)}
            />
            <label>Venue category</label>
            <select
              required
              name="category"
              value={product.category}
              onChange={(e) => handelInputChange(e)}
            >
              <option value="" disabled>
                -- Choose Product Category --
              </option>
              {categories.map((cat) => {
                return (
                  <option value={cat.name} key={cat.id}>
                    {cat.name}
                  </option>
                );
              })}
            </select>
            <label>Venue city</label>
            <select
              required
              name="city"
              value={product.city}
              onChange={(e) => handelInputChange(e)}
            >
              <option value="" disabled>
                -- Choose Venue City --
              </option>
              {cities.map((cat) => {
                return (
                  <option value={cat.name} key={cat.id}>
                    {cat.name}
                  </option>
                );
              })}
            </select>
            <label>Venue description</label>
            <textarea
              name="desc"
              required
              value={product.desc}
              cols={30}
              rows={10}
              onChange={(e) => handelInputChange(e)}
            ></textarea>
            <button className="--btn --btn-primary">
              {detectForm(id!, "Save Venue", "Edit Venue")}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddProduct;
