import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { Modal } from "antd";
import { Card } from "../../../components/card/Card";
import style from "./dateModal.module.scss";

import { SlCalender } from "react-icons/sl";
import { toast } from "react-toastify";

const AdBookings = ({ bookingDates }: { bookingDates: string[] }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <SlCalender
        onClick={showModal}
        size={18}
        title="Booking Dates"
        color="green"
        style={{ cursor: "pointer" }}
      />
      <Modal
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        width={400}
      >
        <h2>Booking Dates</h2>
        {bookingDates.map((date, index) => {
          const parts = date.split("-");
          const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
          return <p key={index}>{formattedDate}</p>;
        })}
      </Modal>
    </>
  );
};

export default AdBookings;
