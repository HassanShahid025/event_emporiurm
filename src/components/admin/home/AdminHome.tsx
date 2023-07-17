import { useEffect, useState } from "react";
import style from "./adminHome.module.scss";
import InfoBox from "../../infoBox/InfoBox";
import { FaUsers } from "react-icons/fa";
import { RiAdvertisementFill } from "react-icons/ri";
import { BiSad } from "react-icons/bi";
import Chart from "../../chart/Chart";

//Icons
const userIcon = <FaUsers size={30} color="#b624ff" />;
const adIcon = <RiAdvertisementFill size={30} color="#1f93ff" />;
const complainIcon = <BiSad size={30} color="#f7c17b" />;

const AdminHome = () => {
  const [userCount, setUserCount] = useState(0);
  const [adsCount, setAdsCount] = useState(0);
  const [complaintsCount, setComplaintsCount] = useState(0);

  const getCount = async (
    table: string,
    setFunction: React.Dispatch<React.SetStateAction<number>>
  ) => {
    try {
      const response = await fetch(
        `http://localhost:3000/admin-${table}-count`
      );
      const jsonData = await response.json();
      setFunction(jsonData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCount("users", setUserCount)
    getCount("ads", setAdsCount)
    getCount("complaints", setComplaintsCount)
  },[])


  return (
    <div className={style.home}>
      <h2>Admin Home</h2>
      <div className={style["info-box"]}>
        <InfoBox
          cardClass={"1"}
          title={"Users"}
          count={userCount}
          icon={userIcon}
        />
        <InfoBox
          cardClass={`${style.card} ${style.card2}`}
          title={"Ads"}
          count={adsCount}
          icon={adIcon}
        />
        <InfoBox
          cardClass={`${style.card} ${style.card3}`}
          title={"Complaints"}
          count={complaintsCount}
          icon={complainIcon}
        />
      </div>
      <div>
        <Chart />
      </div>
    </div>
  );
};

export default AdminHome;
