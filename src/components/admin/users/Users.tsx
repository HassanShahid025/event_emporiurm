import  { useEffect, useState } from "react";
import  "../viewProducts/viewProducts.scss";
import spinnerImg from '../../../assets/spinner.jpg'
import Search from "../../search/Search";
import Pagination from "../../pagination/Pagination";
import { toast } from "react-toastify";
import Notiflix from "notiflix";

const Orders = () => {
  // const { data, isLoading } = useFetchCollection("orders");
  // const { orderHistory } = useSelector((store: RootState) => store.order);
  const [isLoading, setIsLoading] = useState(false)
  const [users, setUser] = useState<any[]>([])
  const [filterUsers, setFilterUsers] = useState<any[]>([])
  
  const [search, setSearch] = useState("")

  const getUsers = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("http://localhost:3000/users");
      const jsonData = await response.json();
      setUser(jsonData)
      setIsLoading(false)
    } catch (error) {
      console.log(error)
      setIsLoading(false)
    }
    
  };

  const blockUser = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:3000/user-block/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      getUsers();
      toast.success("User blocked")
    } catch (error) {
      toast.error("error occured")
    }
  }

  const unBlockUser = async(id:string) => {
    try {
      const response = await fetch(`http://localhost:3000/user-unblock/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });
      getUsers();
      toast.success("User unblocked")
    } catch (error) {
      toast.error("error occured")
    }
  }

  const confirmBlock = (id:string) => {
    Notiflix.Confirm.show(
      "Block User",
      "You are about to block this user?",
      "Block",
      "Cancel",
      function okCb() {
        blockUser(id!);
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

  const confirmUnblock = (id:string) => {
    Notiflix.Confirm.show(
      "Unblock User",
      "You are about to unblock this user?",
      "Unblock",
      "Cancel",
      function okCb() {
        unBlockUser(id!);
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

  const filter = () => {
    if(search.length === 0){
      setFilterUsers(users)
    }else{
      const newUser = users.filter((user) => 
    user.first_name?.toLowerCase().includes(search.toLowerCase()) ||
    user.city?.toLowerCase().includes(search.toLowerCase())||
    user.gender?.toLowerCase().includes(search.toLowerCase())||
    user.last_name?.toLowerCase().includes(search.toLowerCase())
    )
    setFilterUsers(newUser)
    }
    
  }

  useEffect(() => {
    const removeAdmin = users.filter((user) => user.user_id !== 6)
    setFilterUsers(removeAdmin)
  },[users])

  useEffect(() => {
    getUsers()
  },[])

  useEffect(() => {
    filter()
  },[search])

  // const dispatch = useDispatch();
  // useEffect(() => {
  //   dispatch(store_order(data));
  // }, [data]);

  // const navigate = useNavigate();

  // const handleClick = (id: string) => {
  //   navigate(`/admin/order-details/${id}`);
  // };

    //Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const [productsPerPage, setProductsPerPage] = useState(10);
    // Get current products
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filterUsers.slice(
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
        <h2>All Users</h2>
        <div className="search">
          {filterUsers.length !== 0 && (
            <p>
              <b>{filterUsers.length} </b>
              {filterUsers.length > 1 ? "users found" : "user found"}
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
        {filterUsers.length === 0 ? (
          <p>No user found.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>s/n</th>
                <th>Name</th>
                <th>Email</th>
                <th>City</th>
                <th>Gender</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterUsers.map((user, index) => {
                const { first_name, user_id, city, gender, email,is_blocked } = user;
                return (
                  <tr key={user_id}>
                    <td>{index + 1}</td>
                    {/* <td>
                      <img
                        src={images![0]}
                        alt={name}
                        style={{ width: "100px" }}
                      />
                    </td> */}
                    <td>{first_name}</td>
                    <td>{email}</td>
                    <td>{city}</td>
                    <td>{gender}</td>
                    <td className="icons">

                      {!is_blocked ? (
                        <button className="admin-user-btn" onClick={() => confirmBlock(user_id!)}>
                        Block User
                </button>
                      ):(
                        <button className="admin-user-btn" onClick={() => confirmUnblock(user_id!)}>
                        Unblock User
                </button>
                      )}

                     
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
          totalProducts={filterUsers.length}
        />
      </div>
    </>
  );
};

export default Orders;
