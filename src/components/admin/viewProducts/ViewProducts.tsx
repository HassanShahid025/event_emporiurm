import { useEffect, useState } from "react";
import "./viewProducts.scss";
import { toast } from "react-toastify";

import {  FaTrashAlt } from "react-icons/fa";

import Notiflix from "notiflix";
import { useDispatch } from "react-redux";
import { Store_Products } from "../../../redux/features/productSlice";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { filter_by_search } from "../../../redux/features/filterSlice";
import Search from "../../search/Search";
import Pagination from "../../pagination/Pagination";
import spinnerImg from '../../../assets/spinner.jpg'

const ViewProducts = () => {
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false)
  const { filteredProducts } = useSelector((store: RootState) => store.filter);
  const { products } = useSelector((store: RootState) => store.product);
  const dispatch = useDispatch();

  const getAds = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/ads");
      const jsonData = await response.json();
      dispatch(Store_Products({products:jsonData}))
      setIsLoading(false)
      console.log(products);
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
    
  };

  const deleteItem = async (id: string) => {
    try {
      const deleteAd = await fetch(`http://localhost:3000/ads/${id}`, {
        method: "DELETE",
      });
      const newAds = products.filter((ad) => ad.ad_id !== id )
      dispatch(Store_Products({products:newAds}))
      // setAds(prevAds => prevAds.filter(ad => ad.ad_id !== id))
   toast.success("Ad deleted")
   getAds()
    } catch (error) {
      toast.error("error occured while deleting")
    }}

    useEffect(() => {
      getAds()
    },[])


  useEffect(() => {
    dispatch(filter_by_search({ products, search }));
  }, [search, products]);

  const confirmDelete = (id: string) => {
    Notiflix.Confirm.show(
      "Delete Product",
      "You are about to delete this product?",
      "Delete",
      "Cancel",
      function okCb() {
        deleteItem(id!);
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


  //Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      {isLoading && (
        <div className="loading-container">
        <img
           src={spinnerImg}
         />
     </div>
      )}
      <div className="table">
        <h2>All Products</h2>
        <div className="search">
          {filteredProducts.length !== 0 && (
            <p>
              <b>{filteredProducts.length} </b>
              {filteredProducts.length > 1 ? "ads found" : "ad found"}
            </p>
          )}
          {/* {Search Icon} */}
          <div>
            <Search
              value={search}
              onChange={(e: any) => setSearch(e.target.value)}
            />
          </div>
        </div>
        {filteredProducts.length === 0 ? (
          <p>No product found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>City</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => {
                const { ad_id, name, images, price, category,city } = product;
                return (
                  <tr key={ad_id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={images![0]}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>{city}</td>
                    <td>{`$${price}`}</td>
                    <td className="icons">

                      <FaTrashAlt
                        color="red"
                        size={18}
                        onClick={() => confirmDelete(ad_id!)}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          productsPerPage={productsPerPage}
          totalProducts={filteredProducts.length}
        />
      </div>
    </>
  );
};

export default ViewProducts;
