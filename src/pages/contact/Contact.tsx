import style from "./contact.module.scss";
import { Card } from "../../components/card/Card";
import { FaEnvelope, FaPhoneAlt, FaTwitter } from "react-icons/fa";
import { GoLocation } from "react-icons/go";
import { useRef } from "react";
import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

type FormRefType = HTMLFormElement | null;

const Contact = () => {
  const form = useRef<FormRefType>(null);

  const sendEmail = async(e:any) => {
    e.preventDefault();
    const user_name = form.current?.user_name.value
    const user_email = form.current?.user_email.value
    const subject = form.current?.subject.value
    const message = form.current?.message.value

    try {
      const body = { user_name, user_email, subject, message };
      const response = await fetch("http://localhost:3000/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    } catch (error) {
    }

    emailjs.sendForm('service_udxm96n', 'template_q5oxrcm', form.current!, '2Z0mlE3kq0KetsF0-')
      .then((result) => {
          console.log(result.text);
          toast.success("Message sent")
          e.target.reset()
      }, (error) => {
          console.log(error.text);
          toast.success("error occured")
      });
  };

  return (
    <section>
      <div className={`container ${style.contact}`}>
        <h2>Contact Us</h2>
        <div className={style.section}>
          <form onSubmit={sendEmail} ref={form}>
            <Card cardClass={style.card}>
              <label>Name:</label>
              <input
                type="text"
                name="user_name"
                placeholder="Full Name"
                required
              />
              <label>Email:</label>
              <input
                type="email"
                name="user_email"
                placeholder="Active Email"
                required
              />
              <label>Subject:</label>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
              />
              <label>Your Message:</label>
              <textarea name="message" cols={30} rows={10} required></textarea>
              <button type="submit" className="--btn --btn-primary">
                Send Message
              </button>
            </Card>
          </form>
          <div className={style.details}>
            <Card cardClass={style.card2}>
              <h3>Our Contact Information</h3>
              <p>Fill the form or contact us via other channels listed below</p>
              <div className={style.icons}>
                <span>
                  <FaPhoneAlt />
                  <p>+92 333 3248521</p>
                </span>
                <span>
                  <FaEnvelope />
                  <p>support@edukaan.com</p>
                </span>
                <span>
                  <GoLocation />
                  <p>+92 333 3248521</p>
                </span>
                <span>
                  <FaTwitter />
                  <p>@eDukaan</p>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
