import { useState } from "react";
import style from "./checkoutdetails.module.scss";
import { Card } from "../../components/card/Card";
import { CountryDropdown } from "react-country-region-selector";
import { useDispatch } from "react-redux";
import { save_billingAddress, save_shippingAddress } from "../../redux/features/checkoutSlice";
import { useNavigate } from "react-router-dom";
import CheckoutSummary from "../../components/checkoutSummary/CheckoutSummary";

const initialAddressState = {
  name: "",
  address: "",
  city: "",
  state: "",
  postal_code: "",
  country: "",
  phone: "",
};

const CheckoutDetails = () => {
  const [shippingAddress, setShippingAddress] = useState({
    ...initialAddressState,
  });
  const [billingAddress, setBillingAddress] = useState({
    ...initialAddressState,
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleShipping = (e: any) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };
  const handleBilling = (e: any) => {
    const { name, value } = e.target;
    setBillingAddress({ ...billingAddress, [name]: value });
  };
  const handleSubmit = (e:any) => {
    e.preventDefault();
    dispatch(save_billingAddress(billingAddress))
    dispatch(save_shippingAddress(shippingAddress))
    navigate("/checkout")
  };

  return (
    <section>
      <div className={`container ${style.checkout}`}>
        <h2>Checkout Details</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <Card cardClass={style.card}>
              <h3>Shipping Address</h3>
              <label>Recipient Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Recipient Name"
                required
                value={shippingAddress.name}
                onChange={(e) => handleShipping(e)}
              />
              <label>Address:</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                value={shippingAddress.address}
                onChange={(e) => handleShipping(e)}
              />
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={shippingAddress.city}
                onChange={(e) => handleShipping(e)}
              />
              <label>State:</label>
              <input
                type="text"
                name="postal_code"
                placeholder="State"
                required
                value={shippingAddress.postal_code}
                onChange={(e) => handleShipping(e)}
              />
              <label>Country:</label>
              <CountryDropdown
                classes={style.select}
                valueType="short"
                value={shippingAddress.country}
                onChange={(val) =>
                  handleShipping({
                    target: {
                      name: "country",
                      value: val,
                    },
                  })
                }
              />
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                required
                value={shippingAddress.phone}
                onChange={(e) => handleShipping(e)}
              />
            </Card>
            {/* {Billing Address} */}
            <Card cardClass={style.card}>
              <h3>Billing Address</h3>
              <label>Recipient Name:</label>
              <input
                type="text"
                name="name"
                placeholder="Recipient Name"
                required
                value={billingAddress.name}
                onChange={(e) => handleBilling(e)}
              />
              <label>Address:</label>
              <input
                type="text"
                name="address"
                placeholder="Address"
                required
                value={billingAddress.address}
                onChange={(e) => handleBilling(e)}
              />
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                required
                value={billingAddress.city}
                onChange={(e) => handleBilling(e)}
              />
              <label>State:</label>
              <input
                type="text"
                name="postal_code"
                placeholder="State"
                required
                value={billingAddress.postal_code}
                onChange={(e) => handleBilling(e)}
              />
              <label>Country:</label>
              <CountryDropdown
                classes={style.select}
                valueType="short"
                value={shippingAddress.country}
                onChange={(val) =>
                  handleShipping({
                    target: {
                      name: "country",
                      value: val,
                    },
                  })
                }
              />
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                required
                value={shippingAddress.phone}
                onChange={(e) => handleShipping(e)}
              />
              <button type="submit" className="--btn --btn-primary">
                Proceed To Checkout
              </button>
            </Card>
          </div>
          <div>
            <Card cardClass={style.card}>
                <CheckoutSummary/>
            </Card>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CheckoutDetails;
