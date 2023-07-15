import { useState } from "react";
import "./dropdown.scss";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { FaUserAlt, FaListAlt, FaBuysellads } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { AiFillHeart } from "react-icons/ai";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import type { MenuProps } from "antd";
import { Dropdown, Space } from "antd";

const UserDropdown = () => {
  const { userName, user_id } = useSelector((store: RootState) => store.auth);
  const navigate = useNavigate();

  const logoutUser = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout Successful");
        navigate("/");
      })
      .catch((error) => {
        toast.error(error.message);
      });
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
          {userName}
          <MdKeyboardArrowDown size={25} />
        </Space>
      </a>
    </Dropdown>
  );
};

export default UserDropdown;
