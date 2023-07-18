import { useSelector } from "react-redux";
import style from "./myAds.module.scss";
import { RootState } from "../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { IProducts } from "../../types";
import { FaTrashAlt,FaEdit } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { clear_cart, toggle_favourite } from "../../redux/features/cartSlice";
import Notiflix from "notiflix";
import useFetchDocument from "../../customHooks/useFetchDocument";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Store_Products } from "../../redux/features/productSlice";
import {  DatePickerr } from "../../components/datepicker/Datepicker";
import DateModal from "../../components/datepicker/DateModal";


const MyAds = () => {
  const { cartItems} = useSelector(
    (store: RootState) => store.cart
  );
  const { user_id } = useSelector((store: RootState) => store.auth.auth);
  const {document} = useFetchDocument("myads" , user_id!)
  const [ads, setAds] = useState<IProducts[]>([]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getAds = async () => {
    try {
      const response = await fetch("http://localhost:3000/ads");
      const jsonData = await response.json();
      dispatch(Store_Products({products:jsonData}))
      console.log(jsonData);

    } catch (error) {
      console.log(error)
    }
  };

  useEffect(() => {
    getAds()
  },[dispatch])

  useEffect(() => {
    if(document !== null){
      setAds(document)
    }
  },[document,user_id])

  console.log(ads)

  const deleteItem = async (id: string) => {
    try {
      const deleteAd = await fetch(`http://localhost:3000/ads/${id}`, {
        method: "DELETE",
      });
      setAds(prevAds => prevAds.filter(ad => ad.ad_id !== id))
   toast.success("Ad deleted")
    } catch (error) {
      toast.error("error occured while deleting")
    }
  };


  const deleteAd = (ad: IProducts) => {
    Notiflix.Confirm.show(
      "Remove Venue",
      "You are about to delete this ad?",
      "Delete",
      "Cancel",
      function okCb() {
        deleteItem(ad.ad_id!)
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
  };

  const editAd = (ad_id:string) => {
      navigate(`/add-product/${ad_id}`)
  }

  const clearCart = () => {
    Notiflix.Confirm.show(
      "Clear Favourites",
      "You are about to clear the favourites?",
      "Clear",
      "Cancel",
      function okCb() {
        dispatch(clear_cart());
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
  };

  function formatDate(dateString:string) {
    const dateObj = new Date(dateString);
    
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = dateObj.getFullYear();
  
    return `${day}-${month}-${year}`;
  }


  return (
    <section>
      <div className={`container ${style.table}`}>
        <h2>Your Ads</h2>
        {ads.length === 0 ? (
          <>
            <p>You have no ads.</p>
            <br />
            <div>
              <Link to="/#products">&larr; Continue browsing</Link>
            </div>
          </>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Ads</th>
                  <th>Price</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ads.map((ad: IProducts, index: number) => {
                  const { ad_id, name, price, images, cartQuantiy,category,ad_date } = ad;
                  const formattedDate = formatDate(ad_date!)
                  return (
                    <tr key={ad_id}>
                      <td>{index + 1}</td>
                      <td>
                        <p>
                          <b>{name}</b>
                        </p>
                        <Link to={`/product-details/${ad_id}`}>
                        <img
                          src={images![0]}
                          alt={name}
                          style={{ width: "100px" }}
                        />
                        </Link>
                      </td>
                      <td>{price}</td>
                      <td>
                        {category}
                        {/* <div className={style.count}>
                          <button
                            className="--btn"
                           
                          >
                            -
                          </button>
                          <p>
                            <b>{cartQuantiy}</b>
                          </p>
                          <button
                            className="--btn"
                          
                          >
                            +
                          </button>
                        </div> */}
                      </td>
                      <td>{formattedDate}</td>
                      <td className={style.icons}>
                        <DateModal ad_id={ad_id!}/>
                        <FaEdit
                        size={18}
                        color="green"
                        title="Edit"
                        onClick={() => editAd(ad_id!)}
                        />
                        <FaTrashAlt
                          size={18}
                          color="red"
                          title="Delete"
                          onClick={() => deleteAd(ad)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className={style.summary}>
              <button className="--btn --btn-danger" onClick={clearCart}>
                Clear Cart
              </button>
              <div className={style.checkout}>
                <div>
                  <Link to="/#products">Continue Browsing</Link>
                </div>
                <br />
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default MyAds;
