import { useEffect, useState } from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";
import DatePanel from "react-multi-date-picker/plugins/date_panel";
import { Modal } from "antd";
import style from "./dateModal.module.scss";

import { SlCalender } from "react-icons/sl";
import { toast } from "react-toastify";

const DateModal = ({ ad_id }: { ad_id: string }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [value, setValue] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState<any[]>([]);

  const getBookings = async () => {
    console.log(ad_id);
    try {
      const response = await fetch(`http://localhost:3000/bookings/${ad_id}`);
      const jsonData = await response.json();
      const convertedDates = (jsonData.booking_dates as string[]).map(
        (date) => new Date(date).toISOString().split("T")[0]
      );
      console.log(convertedDates);
      console.log(jsonData);
      setBookingData(convertedDates);
    } catch (error) {
      console.log("error occured");
    }
  };

  useEffect(() => {
    if (bookingData.length !== 0) {
      setValue(bookingData);
    }
  }, [bookingData]);

  const showModal = () => {
    setIsModalOpen(true);
    getBookings();
  };

  const handleOk = () => {
    setIsModalOpen(false);
    setBookingData([]);
    setValue([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setBookingData([]);
    setValue([]);
  };

  console.log("val", value);
  console.log("book", bookingData);

  const handleSubmit = async () => {
    const dates = value.map((date) => {
      const year = String(date.year);
      const month = String(date.month).padStart(2, "0");
      const day = String(date.day).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });

    try {
      const body = { ad_id, booking_dates: dates };
      const response = await fetch(
        `http://localhost:3000/booking-add/${ad_id}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      handleOk();
      toast.success("Bookings added");
      setValue([]);
    } catch (error) {
      toast.error("error occured");
    }
  };

  const handleEdit = async () => {
    const dates = value.map((date) => {
      const year = String(date.year);
      const month = String(date.month).padStart(2, "0");
      const day = String(date.day).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });

    try {
      const body = { ad_id, booking_dates: dates };
      const response = await fetch(
        `http://localhost:3000/bookings-update/${ad_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );
      toast.success("Bookings updated");
      setValue([]);
      handleOk();
    } catch (error) {
      toast.error("Error occurred");
    }
  };

  return (
    <>
      <SlCalender
        onClick={showModal}
        size={18}
        title="Booking Dates"
        color="green"
      />
      <Modal
        open={isModalOpen}
        onOk={bookingData.length === 0 ? handleSubmit : handleEdit}
        onCancel={handleCancel}
        width={500}
      >
        <h2>Booking Dates</h2>

        <div className={style.section}>
          <DatePicker
            value={value}
            onChange={setValue}
            multiple
            plugins={[<DatePanel sort="date" />]}
          />
        </div>

      
      </Modal>
    </>
  );
};

export default DateModal;
