import React, { useContext, useState, useEffect } from "react";
import { StoreContext } from "../../../../Context/StoreContext";
import { useNavigate } from "react-router-dom";
import "./Placeorder.css";
import StripePayment from "../../../StripePayment/StripePayment";

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, setcartItems, url, setshowLogin } =
    useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
  });

  const [ready, setReady] = useState(false); // wait for data
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState({ clientSecret: "", orderId: "" });
  const [isOrderCompleted, setIsOrderCompleted] = useState(false);
  const [finalAmount, setFinalAmount] = useState(0);

  const navigate = useNavigate();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();

    const orderItems = food_list
      .filter((item) => cartItems[item._id] > 0)
      .map((item) => ({ ...item, quantity: cartItems[item._id] }));

    if (orderItems.length === 0) return alert("Your cart is empty!");

    const totalAmount = orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0) + 2;

    const orderData = {
      address: data,
      items: orderItems,
      amount: totalAmount,
    };

    try {
      const response = await fetch(`${url}/api/order/place`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData)
      });
      const responseData = await response.json();

      if (responseData.success) {
        setFinalAmount(totalAmount);
        setPaymentData({
          clientSecret: responseData.clientSecret,
          orderId: responseData.orderId
        });
        setShowPaymentModal(true);
      } else {
        alert(responseData.message || "Error placing order");
      }
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    }
  };

  // ✅ Wait for data to load before redirecting
  useEffect(() => {
    const localToken = localStorage.getItem("token");
    
    // If we have no token at all, stop them here
    if (!token && !localToken) {
        alert("Please Login to proceed to checkout");
        setshowLogin(true); // Open the login popup
        navigate('/cart');
        return;
    }

    // Only set ready when both list and token are available
    if (token && food_list.length > 0) {
      setReady(true);
    }
  }, [token, food_list, cartItems, navigate, setshowLogin]);

  useEffect(() => {
    if (!ready || showPaymentModal || isOrderCompleted) return; // only check after ready and if modal is not open/order not done
    if (getTotalCartAmount() === 0) {
      alert("Your cart is empty!");
      navigate("/cart");
    }
  }, [ready, getTotalCartAmount, navigate, showPaymentModal, isOrderCompleted]);

  if (!ready) return <p>Loading...</p>; // show loading until ready

  return (
    <>
      <form onSubmit={placeOrder} className="place-oder">
        <div className="place-oder-left">
          <p className="title">Delivery Information</p>
          <div className="multi-fields">
            <input
              required
              name="firstName"
              onChange={onChangeHandler}
              value={data.firstName}
              type="text"
              placeholder="First Name"
            />
            <input
              required
              name="lastName"
              onChange={onChangeHandler}
              value={data.lastName}
              type="text"
              placeholder="Last Name"
            />
          </div>
          <input
            required
            name="email"
            onChange={onChangeHandler}
            value={data.email}
            type="email"
            placeholder="Email Address"
          />
          <input
            required
            name="street"
            onChange={onChangeHandler}
            value={data.street}
            type="text"
            placeholder="Street"
          />
          <div className="multi-fields">
            <input
              required
              name="city"
              onChange={onChangeHandler}
              value={data.city}
              type="text"
              placeholder="City"
            />
            <input
              required
              name="state"
              onChange={onChangeHandler}
              value={data.state}
              type="text"
              placeholder="State"
            />
          </div>
          <div className="multi-fields">
            <input
              required
              name="zipcode"
              onChange={onChangeHandler}
              value={data.zipcode}
              type="text"
              placeholder="Zip Code"
            />
            <input
              required
              name="country"
              onChange={onChangeHandler}
              value={data.country}
              type="text"
              placeholder="Country"
            />
          </div>
          <input
            required
            name="phone"
            onChange={onChangeHandler}
            value={data.phone}
            type="text"
            placeholder="Phone"
          />
        </div>

        <div className="place-order-right">
          <div className="cart-total">
            <h2>Cart Total</h2>
            <div>
              <div className="cart-total-details">
                <p>SubTotal</p>
                <p>${getTotalCartAmount()}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <p>Delivery Fee</p>
                <p>${getTotalCartAmount() === 0 ? 0 : 2}</p>
              </div>
              <hr />
              <div className="cart-total-details">
                <b>Total</b>
                <b>${getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
              </div>
            </div>
            <button type="submit">Proceed to Payment</button>
          </div>
        </div>
      </form>

      <StripePayment 
        show={showPaymentModal} 
        onClose={() => setShowPaymentModal(false)}
        clientSecret={paymentData.clientSecret}
        orderId={paymentData.orderId}
        amount={finalAmount}
        setIsOrderCompleted={setIsOrderCompleted}
      />
    </>
  );
};

export default PlaceOrder;

