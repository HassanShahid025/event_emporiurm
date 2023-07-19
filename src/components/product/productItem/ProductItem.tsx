import  { useEffect, useState } from "react";
import style from "./ProductItem.module.scss";
import { IProducts } from "../../../types";
import { Card } from "../../card/Card";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AiOutlineHeart, AiTwotoneHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { toast } from "react-toastify";
import loadingImg from "../../../assets/loadingImg.jpg"

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


  useEffect(() => {
    setWindowWidth(windowWidth);
  }, [grid]);

  // dummy image while image loading

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const loadImage = new Image();
    loadImage.onload = () => {
      setIsLoading(false);
    };
    loadImage.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    loadImage.src = images![0]; // Replace with your Firebase Storage image URL
  }, []);

  return (
    <Card cardClass={grid ? `${style.grid}` : `${style.list}`}>
      <Link to={`/product-details/${ad_id}`}>
        <div className={style.img}>
         
        {isLoading && <img src={loadingImg} alt="Placeholder Image" />}
      {!isLoading && !hasError && (
        <img src={images![0]} alt="Actual Image" />
      )}
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
      </div>
    </Card>
  );
};

export default ProductItem;
