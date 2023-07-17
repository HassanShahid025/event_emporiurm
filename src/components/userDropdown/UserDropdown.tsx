import { useState } from "react";
import "./dropdown.scss";
import { MdKeyboardArrowDown } from "react-icons/md";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt, FaListAlt, FaBuysellads } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";
import { useDispatch } from "react-redux";
import { removeUser } from "../../redux/features/authSlice";

const UserDropdown = () => {
  const { user} = useSelector((store: RootState) => store.auth.auth);
  const {first_name,user_id} = user!
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const logoutUser = () => {
    dispatch(removeUser());
    navigate("/");
    toast.success("Logout Successful");
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <Link to={`/favourites/${user_id}`}>Favourites</Link>,
      icon: <AiFillHeart />,
    },
    {
      key: "2",
      label: <Link to={`/view-profile/${user_id}`}>View and Edit profile</Link>,
      icon: <FaUserAlt />,
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          Todo List (disabled)
        </a>
      ),
      icon: <FaListAlt />,
      disabled: true,
    },
    {
      key: "4",
      label: (
        <Link
        to={`/my-ads/${user_id}`}
         
        >
          My Ads
        </Link>
      ),

      icon: <FaBuysellads />,
    },
    {
      key: "5",
      danger: true,
      label: "Logout",
      icon: <BiLogOut />,
      onClick : logoutUser
    },
  ];

  return (
    <Dropdown menu={{ items }}>
      <a onClick={(e) => e.preventDefault()}>
        <Space className="dropdown-items">
          {first_name}
          <MdKeyboardArrowDown size={25} />
        </Space>
      </a>
    </Dropdown>
  );
};

export default UserDropdown;
