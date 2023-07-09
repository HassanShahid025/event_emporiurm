import React, { useEffect, useState } from "react";
import style from "./ProductList.module.scss";
import { IProducts } from "../../../types";
import { BsFillGridFill } from "react-icons/bs";
import { FaListAlt } from "react-icons/fa";
import Search from "../../search/Search";
import ProductItem from "../productItem/ProductItem";
import { useDispatch } from "react-redux";
import {
  filter_by_search,
  filter_by_sort,
} from "../../../redux/features/filterSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import Pagination from "../../pagination/Pagination";

interface IProductList {
  products: IProducts[];
}

export const ProductList = ({ products }: IProductList) => {
  const [grid, setGrid] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  const { filteredProducts } = useSelector((store: RootState) => store.filter);

  //Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(9);
  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(filter_by_search({ products, search }));
  }, [search, products]);

  useEffect(() => {
    dispatch(filter_by_sort({ products, sort }));
  }, [dispatch, sort, products]);

  return (
    <div className={style["product-list"]} id="product">
      <div className={style.top}>
        <div className={style.icons}>
          <BsFillGridFill
            size={22}
            color="#325662"
            onClick={() => setGrid(true)}
          />
          <FaListAlt size={24} color="#0066d4" onClick={() => setGrid(false)} />
          <p>
            <b>{filteredProducts.length}</b>{" "}
            {filteredProducts.length > 1 ? "Products found." : "Product found."}
          </p>
        </div>
        {/* {Search Icon} */}
        <div>
          <Search
            value={search}
            onChange={(e: any) => setSearch(e.target.value)}
          />
        </div>
        {/* {Sort Product} */}
        <div className={style.sort}>
          <label>Sort by:</label>
          <select value={sort} onChange={(e: any) => setSort(e.target.value)}>
            <option value="latest">Latest</option>
            <option value="lowest-price">Lowest Price</option>
            <option value="highest-price">Highest Price</option>
            <option value="a-z">A - Z</option>
            <option value="z-a">Z - A</option>
          </select>
        </div>
      </div>
      <div className={grid ? `${style.grid}` : `${style.list}`}>
        {filteredProducts.length === 0 ? (
          <p>No product found.</p>
        ) : (
          <>
            {currentProducts.map((product) => {
              return (
                <div key={product.id}>
                  <ProductItem product={product} grid={grid} />
                </div>
              );
            })}
          </>
        )}
      </div>
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        productsPerPage={productsPerPage}
        totalProducts={filteredProducts.length}
      />
    </div>
  );
};
