import { useState, useEffect } from "react";
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
import { useDispatch } from "react-redux";
import { Store_Products } from "../../../redux/features/productSlice";
import Notiflix from "notiflix";
import useFetchCollection from "../../../customHooks/useFetchCollection";

const categories = [
  {
    id: 1,
    name: "Venue",
  },
  {
    id: 2,
    name: "Photography",
  },
  {
    id: 3,
    name: "Food Catering",
  },
  {
    id: 4,
    name: "Decoration",
  },
];

const venueCategories = [
  {
    id: 5,
    name: "Outdoor",
  },
  {
    id: 6,
    name: "Indoor",
  },
];
const cities = [
  {
    id: 7,
    name: "Karachi",
  },
  {
    id: 8,
    name: "Lahore",
  },
  {
    id: 9,
    name: "Islamabad",
  },
];

const initialState = {
  name: "",
  images: [],
  price: 0,
  city: "",
  location: "",
  category: "",
  venue_category: "",
  ad_desc: "",
  ad_date: "",
};

const AddProduct = () => {
  const { user_id } = useSelector((store: RootState) => store.auth);
  const { id } = useParams();

  const [date, setDate] = useState("");

  const dispatch = useDispatch();
 

  useEffect(() => {
    const todaydate = new Date();
    const year = String(todaydate.getFullYear());
    const month = String(todaydate.getMonth() + 1).padStart(2, "0");
    const day = String(todaydate.getDate()).padStart(2, "0");
    setDate(`${year}-${month}-${day}`);
  }, []);
  
  const { products } = useSelector((store: RootState) => store.product);

  const productEdit = products.find((item) => item.ad_id == id);

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

  const editProduct = async () => {
    setIsLoading(true);
    try {
      const {
        name,
        images,
        price,
        city,
        location,
        category,
        venue_category,
        ad_desc,
        ad_date,
      } = product;
      const body = {
        name,
        images,
        price,
        city,
        location,
        category,
        venue_category,
        ad_desc,
        ad_date,
        user_id,
      };
      const response = await fetch(`http://localhost:3000/ads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setProduct(initialState)
      toast.success("Ad edited successfully")
      navigate(`/my-ads/${user_id}`)
    } catch (error) {
      toast.error("Error Occured")
    }
  };

  const editModal = (e:any) => {
    e.preventDefault();

    Notiflix.Confirm.show(
      "Edit Ad",
      "You are about to edit this ad?",
      "Edit",
      "Cancel",
      function okCb() {
        editProduct()
      },
      function cancelCb() {
        console.log("cancel");
      },
      {
        width: "320px",
        borderRadius: "8px",
        titleColor: "#f7c17b",
        okButtonBackground: "#f7c17b",
        cssAnimationStyle: "zoom",
      }
    );
  }

  const handelInputChange = (e: any) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const setImageURL = (downloadURL: string) => {
    setProduct({ ...product, images: [...product.images!, downloadURL] });
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
          setImageURL(downloadURL);
          toast.success("Image uploaded successfully.");
        });
      }
    );
  };

  const addProduct = async (e: any) => {
    console.log("date:", date);
    setProduct({ ...product, ad_date: date });
    console.log("ad date:", product.ad_date);
    e.preventDefault();
    setIsLoading(true);

    try {
      const {
        name,
        images,
        price,
        city,
        location,
        category,
        venue_category,
        ad_desc,
        ad_date,
      } = product;
      const body = {
        name,
        images,
        price,
        city,
        location,
        category,
        venue_category,
        ad_desc,
        ad_date,
        user_id,
      };

      const response = await fetch("http://localhost:3000/ads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setProduct({ ...initialState });
      setIsLoading(true);
      toast.success("AD added");
    } catch (error) {
      setIsLoading(true);
      console.log(error);
      toast.error("error");
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
      <section>
        <div className="container">
          <div className={styles.product}>
            <h2>{detectForm(id!, "Create Ad", "Edit Ad")}</h2>
            <Card cardClass={styles.card}>
              <form onSubmit={detectForm(id!, addProduct, editModal)}>
                <div className={styles.flex}>
                  <div>
                    <label>Name:</label>
                    <input
                      type="text"
                      placeholder="Name"
                      required
                      name="name"
                      value={product.name}
                      onChange={(e) => handelInputChange(e)}
                    />
                  </div>
                  <div>
                    <label>Price:</label>
                    <input
                      type="number"
                      placeholder="Product price"
                      required
                      name="price"
                      value={product.price}
                      onChange={(e) => handelInputChange(e)}
                    />
                  </div>
                </div>

                <label>Images:</label>
                {/* <Card className={styles.group}> */}
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

                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.images![0]}
                />

                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.images![1]}
                />

                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.images![2]}
                />

                <input
                  type="text"
                  // required
                  placeholder="Image URL"
                  name="imageURL"
                  disabled
                  value={product.images![3]}
                />

                {/* </Card> */}

                <div className={styles.flex}>
                  <div>
                    <label>Location:</label>
                    <input
                      type="text"
                      placeholder="Product location"
                      required
                      name="location"
                      value={product.location}
                      onChange={(e) => handelInputChange(e)}
                    />
                  </div>
                  <div>
                    <label>City</label>
                    <select
                      required
                      name="city"
                      value={product.city}
                      onChange={(e) => handelInputChange(e)}
                    >
                      <option value="" disabled>
                        -- Choose City --
                      </option>
                      {cities.map((city) => {
                        return (
                          <option value={city.name} key={city.id}>
                            {city.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>

                <div className={styles.flex}>
                  <div>
                    <label>Category</label>
                    <select
                      required
                      name="category"
                      value={product.category}
                      onChange={(e) => handelInputChange(e)}
                    >
                      <option value="" disabled>
                        -- Choose Category --
                      </option>
                      {categories.map((cat) => {
                        return (
                          <option value={cat.name} key={cat.id}>
                            {cat.name}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    {product.category === "Venue" && (
                      <>
                        <label>Venue Category</label>
                        <select
                          required
                          name="venue_category"
                          value={product.venue_category}
                          onChange={(e) => handelInputChange(e)}
                        >
                          <option value="" disabled>
                            -- Choose Venue Category --
                          </option>
                          {venueCategories.map((cat) => {
                            return (
                              <option value={cat.name} key={cat.id}>
                                {cat.name}
                              </option>
                            );
                          })}
                        </select>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <label>Venue description</label>
                  <textarea
                    name="ad_desc"
                    required
                    value={product.ad_desc}
                    cols={30}
                    rows={10}
                    onChange={(e) => handelInputChange(e)}
                  ></textarea>
                </div>

                <button className="--btn --btn-primary">
                  {detectForm(id!, "Post Ad", "Edit Ad")}
                </button>
              </form>
            </Card>
          </div>
        </div>
      </section>
    </>
  );
};

export default AddProduct;
