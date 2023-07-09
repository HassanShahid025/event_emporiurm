import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import style from "./Productfilter.module.scss";
import { RootState } from "../../../redux/store";
import { useDispatch } from "react-redux";
import {
  filter_by_brand,
  filter_by_category,
  filter_by_price,
} from "../../../redux/features/filterSlice";

const ProductFilter = () => {
  const { products, maxPrice, minPrice } = useSelector(
    (store: RootState) => store.product
  );  
  const [category, setCategory] = useState("All");
  const [brand, setBrand] = useState("All");
  const [price, setPrice] = useState(3000);

  const dispatch = useDispatch();

  const allCategories = [
    "All",
    ...new Set(products.map((product) => product.category)),
  ];

  // const allBrands= [
  //   "All",
  //   ...new Set(products.map((product) => product.brand)),
  // ];

  // useEffect(() => {
  //   dispatch(filter_by_brand({products,brand}))
  // },[brand,products])

  let allBrands: string[] = [];
  const getBrands = (cat: string) => {
    if (cat === "All") {
      allBrands = [
        "All",
        ...new Set(products.map((product) => product.brand!)),
      ];
    } else {
      allBrands = ["All"];
      products.forEach((product) => {
        if (product.category === cat && !allBrands.includes(product.brand!)) {
          allBrands.push(product.brand!);
        }
      });
    }
    return allBrands.map((brand) => {
      return <option value={brand}>{brand}</option>;
    });
  };
  useEffect(() => {
    getBrands(category);
    dispatch(filter_by_brand({ products, brand, category }));
  }, [brand, category, products]);

  useEffect(() => {
    dispatch(filter_by_price({ products, price }));
    setCategory("All")
    setBrand("All")
  }, [price, products]);

  const filterProducts = (cat: string) => {
    setCategory(cat);
    setBrand("All");
    dispatch(filter_by_category({ products, category: cat }));
  };

  const clearFilters = () => {
    setCategory("All")
    setBrand("All")
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
      <h4>Brand</h4>
      <div className={style.brand}>
        <select value={brand} onChange={(e: any) => setBrand(e.target.value)}>
          {getBrands(category)}
          {/* {allBrands.map((brand, index) => {
            return (
              <option key={index} value={brand}>
                {brand}
              </option>
            );
          })} */}
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
