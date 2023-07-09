import { useEffect, useState } from "react";
import "./viewProducts.scss";
import { toast } from "react-toastify";
import { deleteDoc, doc } from "firebase/firestore";
import { db, storage } from "../../../firebase/config";
import { Link } from "react-router-dom";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import Loader from "../../loader/Loader";
import { deleteObject, ref } from "firebase/storage";
import Notiflix from "notiflix";
import { useDispatch } from "react-redux";
import { Store_Products } from "../../../redux/features/productSlice";
import useFetchCollection from "../../../customHooks/useFetchCollection";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store";
import { filter_by_search } from "../../../redux/features/filterSlice";
import Search from "../../search/Search";
import Pagination from "../../pagination/Pagination";
import spinnerImg from '../../../assets/spinner.jpg'

const ViewProducts = () => {
  const { data, isLoading } = useFetchCollection("products");
  const [search, setSearch] = useState("");

  const { filteredProducts } = useSelector((store: RootState) => store.filter);
  const { products } = useSelector((store: RootState) => store.product);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(Store_Products({ products: data }));
  }, [dispatch, data]);

  useEffect(() => {
    dispatch(filter_by_search({ products, search }));
  }, [search, products]);

  const confirmDelete = (id: string, imageURL: string) => {
    Notiflix.Confirm.show(
      "Delete Product",
      "You are about to delete this product?",
      "Delete",
      "Cancel",
      function okCb() {
        deleteProduct(id!, imageURL!);
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

  const deleteProduct = async (id: string, imageURL: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      const storageRef = ref(storage, imageURL);
      await deleteObject(storageRef);
      toast.success("Product deleted successfully");
    } catch (error: any) {
      toast.error(error.message);
    }
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
              {filteredProducts.length > 1 ? "products found" : "product found"}
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
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product, index) => {
                const { id, name, imageURL, price, category } = product;
                return (
                  <tr key={id}>
                    <td>{index + 1}</td>
                    <td>
                      <img
                        src={imageURL}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td>
                    <td>{name}</td>
                    <td>{category}</td>
                    <td>{`$${price}`}</td>
                    <td className="icons">
                      <Link to={`/admin/add-product/${id}`}>
                        <FaEdit color="green" size={20} />
                      </Link>
                      &nbsp;
                      <FaTrashAlt
                        color="red"
                        size={18}
                        onClick={() => confirmDelete(id!, imageURL!)}
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
