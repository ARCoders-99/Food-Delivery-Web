import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./Components/Pages/Home/Home";
import PlaceOrder from "./Components/Pages/Home/PlaceOrder/PlaceOrder";
import Cart from "./Components/Pages/Cart/Cart";
import MyOrders from "./Components/Pages/MyOrders/MyOrders";
import Footer from "./Components/Footer/Footer";
import LoginPopup from "./Components/LoginPopup/LoginPopup";
import { useContext } from "react";
import { StoreContext } from "./Context/StoreContext";

function App() {
  const { showLogin, setshowLogin } = useContext(StoreContext);
  return (
    <>
      {showLogin ? <LoginPopup /> : <></>}
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/order" element={<PlaceOrder />} />
          <Route path="/myorders" element={<MyOrders />} />
        </Routes>
      </div>
      <Footer></Footer>
    </>
  );
}

export default App;
