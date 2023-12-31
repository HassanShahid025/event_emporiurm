import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import style from "./Productfilter.module.scss";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import {
  filter_by_category,
  filter_by_city,
  filter_by_price,
} from "../../../redux/features/filterSlice";

const ProductFilter = () => {
  const { products, maxPrice, minPrice } = useSelector(
    (store: RootState) => store.product
  );  
  const [category, setCategory] = useState("All");
  const [price, setPrice] = useState(3000);
  const [city, setCity] = useState("");
  const [allCities, setAllCities] = useState<string[]>([])

  const dispatch = useDispatch();

  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

 


  // let allCities: string[] = [];
  const getCities = (cat: string) => {
    if (cat === "All") {
      const adCity = new Set(products.map((product) => product.city!))
      setAllCities(["All",...adCity])
     
      
    } else {
      products.forEach((product) => {
        if (product.category === cat && !allCities.includes(product.city!)) {
          setAllCities([...allCities,product.city!])
        }
      });
    }
  };
  useEffect(() => {
    getCities(category);
    dispatch(filter_by_city({ products, city, category }));
  }, [city, category, products]);

  useEffect(() => {
    dispatch(filter_by_price({ products, price }));
    setCategory("All")
  }, [price, products]);

  const filterProducts = (cat: string) => {
    setCategory(cat);
    dispatch(filter_by_category({ products, category: cat }));
  };


  const clearFilters = () => {
    setCategory("All")
    setPrice(maxPrice!)
  }

 

  return (
    <div className={style.filter}>
      <h4>Categories</h4>
      <div className={style.category}>
        {allCategories.map((cat, index) => {
          return (
            <button
              key={index}
              type="button"
              className={cat === category ? `${style.active}` : ""}
              onClick={() => filterProducts(cat!)}
            >
              &#8250; {cat}
            </button>
          );
        })}
      </div>
      <h4>City</h4>
      <div className={style.brand}>
         <select value={city} onChange={(e: any) => setCity(e.target.value)}>
          
          {allCities.map((city, index) => {
            return (
              <option key={index} value={city}>
                {city}
              </option>
            );
          })} 
         </select> 
        <h4>Price</h4>
        <p>${price}</p>
        <div className={style.price}>
          <input
            type="range"
            value={price}
            onChange={(e: any) => setPrice(e.target.value)}
            min={minPrice!}
            max={maxPrice!}
          />
        </div>
        <br />
        <button className="--btn --btn-danger" onClick={clearFilters}>Clear Filter</button>
      </div>
    </div>
  );
};

export default ProductFilter;
