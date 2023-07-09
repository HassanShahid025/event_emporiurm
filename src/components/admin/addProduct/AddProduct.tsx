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
    name: "Laptop",
  },
  {
    id: 2,
    name: "Electronics",
  },
  {
    id: 3,
    name: "Phone",
  },
  {
    id: 4,
    name: "Fashion",
  },
];

const initialState = {
  name: "",
  imageURL: "",
  price: 0,
  brand: "",
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
        brand: product.brand,
        category: product.category,
        desc: product.desc,
        createdAt: productEdit?.createdAt,
        editedAt: Timestamp.now().toDate(),
      });

      if (product.imageURL !== productEdit?.imageURL) {
        const storageRef = ref(storage, productEdit?.imageURL);
        deleteObject(storageRef);
      }
      setIsLoading(false);
      toast.success("Product edited successfully.");
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
          setProduct({ ...product, imageURL: downloadURL });
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
        price: Number(product.price),
        brand: product.brand,
        category: product.category,
        desc: product.desc,
        createdAt: Timestamp.now().toDate(),
      });
      setIsLoading(false);
      setProduct(initialState);
      toast.success("Product uploaded successfully.");
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
        <h2>{detectForm(id!, "Add Product", "Edit Product")}</h2>
        <Card cardClass={styles.card}>
          <form onSubmit={detectForm(id!, addProduct, editProduct)}>
            <label>Product name:</label>
            <input
              type="text"
              placeholder="Product name"
              required
              name="name"
              value={product.name}
              onChange={(e) => handelInputChange(e)}
            />

            <label>Product image:</label>
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
                placeholder="Product Image"
                onChange={(e) => handelImageChange(e)}
              />
              {product.imageURL !== "" ? (
                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.imageURL}
                />
              ) : null}
            </Card>
            <label>Product price:</label>
            <input
              type="number"
              placeholder="Product price"
              required
              name="price"
              value={product.price}
              onChange={(e) => handelInputChange(e)}
            />
            <label>Product Category</label>
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
            <label>Product Company/Brand:</label>
            <input
              type="text"
              placeholder="Product brand"
              required
              name="brand"
              value={product.brand}
              onChange={(e) => handelInputChange(e)}
            />
            <label>Product description</label>
            <textarea
              name="desc"
              required
              value={product.desc}
              cols={30}
              rows={10}
              onChange={(e) => handelInputChange(e)}
            ></textarea>
            <button className="--btn --btn-primary">
              {detectForm(id!, "Save Product", "Edit Product")}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default AddProduct;
