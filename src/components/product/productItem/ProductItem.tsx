import  { useEffect, useState } from "react";
import style from "./ProductItem.module.scss";
import { IProducts } from "../../../types";
import { Card } from "../../card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toggle_favourite } from "../../../redux/features/cartSlice";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Notiflix from "notiflix";
import { addPrevURL } from "../../../redux/features/authSlice";
import { toast } from "react-toastify";

interface IProductItem {
  product: IProducts;
  grid: boolean;
}

const ProductItem = ({ product, grid }: IProductItem) => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { ad_id, name, price, ad_desc, images, city } = product;
  const { cartItems } = useSelector((store: RootState) => store.cart);
  const { user, isLoggedIn } = useSelector((store: RootState) => store.auth.auth);
  const [fav, setFav] = useState<any>([])
  const isFavourite = fav.find((item:any) => item.ad_id === ad_id);
  


  const shortingText = (text: string, n: number) => {
    if (text.length > n) {
      const shortenedText = text.substring(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // const addToCart = (product: IProducts) => {
  //   dispatch(add_to_cart({ product }));
  //   dispatch(calculate_CartTotalQuantity());

  // const checkLogin = async() => {
  //   if (isLoggedIn) {
  //     toggleFavourite();
      
  //   } else {
  //     Notiflix.Confirm.show(
  //       "Login",
  //       "Login to add to favourites",
  //       "Login",
  //       "Cancel",
  //       function okCb() {
  //         navigate("/login");
  //         dispatch(addPrevURL({ product, url: "/" }));
  //       },
  //       function cancelCb() {
  //         console.log("cancel");
  //       },
  //       {
  //         width: "320px",
  //         borderRadius: "8px",
  //         titleColor: "#f7c17b",
  //         okButtonBackground: "#f7c17b",
  //         cssAnimationStyle: "zoom",
  //       }
  //     );
  //   }
  // };

  const addTofav = async(ad_id:string) => {
    if(isLoggedIn){
      try {
        const body = { ad_id: ad_id, user_id: user.user_id };
        const response = await fetch("http://localhost:3000/favourites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        toast.success("Added to favourites")
        getFav()
      } catch (error) {
        toast.error("Error occured")
      }
    }
    else{
      toast.error("Please login first")
    }
  }

  const remove_favourite = async(ad_id:string) => {
    try {
      const deleteFav = await fetch(`http://localhost:3000/favourites-remove-ad/${ad_id}`, {
        method: "DELETE",
      });
      getFav();
      toast.success("Ad removed from favourites")
    } catch (error) {
      toast.error("error occured while removing")
    }
  }

  const getFav = async() => {
    try {
      const response = await fetch(`http://localhost:3000/favourites-ads/${user.user_id}`);
      const jsonData = await response.json();
      setFav(jsonData);
    } catch (error) {
      toast.error("Error occured while fetching favourites")
    }
  }

  

  useEffect(() => {
    if(isLoggedIn){
      getFav()

    }
  },[])


  // const toggleFavourite = () => {
  //   dispatch(toggle_favourite({ product }));
  // };

  useEffect(() => {
    setWindowWidth(windowWidth);
  }, [grid]);

  return (
    <Card cardClass={grid ? `${style.grid}` : `${style.list}`}>
      <Link to={`/product-details/${ad_id}`}>
        <div className={style.img}>
          <img src={images![0]} alt={name} />
        </div>
      </Link>
      <div className={style.content}>
        <div className={style.details}>
          <div>
            <h5>{`Rs ${price}`}</h5>
            {isFavourite ? (
              <AiTwotoneHeart
                size={25}
                style={{ cursor: "pointer" }}
                onClick={() => remove_favourite(ad_id!)}
              />
            ) : (
              <AiOutlineHeart
                size={25}
                style={{ cursor: "pointer" }}
                onClick={() => addTofav(ad_id!)}
              />
            )}
          </div>
          <h4>{shortingText(name!, 18)}</h4>
          <p>{city}</p>
        </div>
        {!grid && (
          <p className={style.desc}>
            {windowWidth > 500
              ? shortingText(ad_desc!, 200)
              : shortingText(ad_desc!, 50)}
          </p>
        )}
        {/* <button
          className="--btn --btn-danger"
          onClick={() => addToCart(product)}
        >
          Add To Cart
        </button> */}
      </div>
    </Card>
  );
};

export default ProductItem;
