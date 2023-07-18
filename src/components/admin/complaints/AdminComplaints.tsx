import { useEffect, useState } from "react";
import "../viewProducts/viewProducts.scss";
import spinnerImg from "../../../assets/spinner.jpg";
import Pagination from "../../pagination/Pagination";
import { toast } from "react-toastify";
import Notiflix from "notiflix";
import { FaTrashAlt } from "react-icons/fa";
import { TbExternalLink } from "react-icons/tb";
import { useNavigate } from "react-router-dom";

const AdminComplaints = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [complaints, setComplaints] = useState<any[]>([]);
  const navigate = useNavigate();

  const getComplaints = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:3000/admin-complaints");
      const jsonData = await response.json();
      setComplaints(jsonData);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const deleteComplain = async (id: string) => {
    try {
      const deleteComplain = await fetch(
        `http://localhost:3000/complain-delete/${id}`,
        {
          method: "DELETE",
        }
      );
      getComplaints();
      toast.success("Complain deleted");
    } catch (error) {
      toast.error("error ocured");
    }
  };

  const confirmDelete = (id: string) => {
    Notiflix.Confirm.show(
      "Delete Complain",
      "You are about to delete this complain?",
      "Delete",
      "Cancel",
      function okCb() {
        deleteComplain(id!);
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

  useEffect(() => {
    getComplaints();
  }, []);

  //Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage, setProductsPerPage] = useState(10);
  // Get current products
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = complaints.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  return (
    <>
      {isLoading && (
        <div className="loading-container">
          <img src={spinnerImg} />
        </div>
      )}
      <div className="table">
        <h2>All Complaints</h2>
        <div className="search">
          {complaints.length !== 0 && (
            <p>
              <b>{complaints.length} </b>
              {complaints.length > 1 ? "complaints found" : "complain found"}
            </p>
          )}
        </div>
        {complaints.length === 0 ? (
          <p>No complain found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>User ID</th>
                <th>Ad ID</th>
                <th>Complain</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complain, index) => {
                const { user_id, ad_id, complain_text, complain_id } = complain;
                return (
                  <tr key={complain_id}>
                    <td>{index + 1}</td>
                    {/* <td>
                      <img
                        src={images![0]}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td> */}
                    <td>{user_id}</td>
                    <td>{ad_id}</td>
                    <td>{complain_text}</td>
                    <td className="icons">
                      <TbExternalLink
                        color="green"
                        size={19}
                        onClick={() => navigate(`/product-details/${ad_id}`)}
                      />
                      <FaTrashAlt
                        color="red"
                        size={18}
                        onClick={() => confirmDelete(complain_id!)}
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
          totalProducts={complaints.length}
        />
      </div>
    </>
  );
};

export default AdminComplaints;
