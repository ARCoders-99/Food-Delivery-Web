import React, { useContext, useState } from "react";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../Context/StoreContext";
import Toast from "../Toast/Toast";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } =
    useContext(StoreContext);
  const [toastMessage, setToastMessage] = useState(null);
  const [isDisabled, setIsDisabled] = useState(false);

  const showToast = (text, variant) => {
    setToastMessage({ id: Date.now(), text, variant });
    setIsDisabled(true);

    setTimeout(() => {
      setToastMessage(null);
      setIsDisabled(false);
    }, 1000);
  };

  const handleAdd = () => {
    addToCart(id);
    showToast("Item added successfully!", "success");
  };

  const handleRemove = () => {
    removeFromCart(id);
    showToast("Item removed successfully!", "error");
  };
  return (
    <>
      {toastMessage && (
        <Toast
          key={toastMessage.id}
          message={toastMessage.text}
          type={toastMessage.variant}
          onClose={() => setToastMessage(null)}
        />
      )}

      <div className="food-item">
        <div className="food-item-img-container">
          <img
            className="food-item-image"
            src={url + "/images/" + image}
            alt=""
          />
          {!cartItems[id] ? (
            <img
              className={`add ${isDisabled ? "disabled" : ""}`}
              onClick={!isDisabled ? handleAdd : undefined}
              src={assets.add_icon_white}
              alt=""
            />
          ) : (
            <div className="food-item-counter">
              <img
                className={isDisabled ? "disabled" : ""}
                onClick={!isDisabled ? handleRemove : undefined}
                src={assets.remove_icon_red}
                alt=""
              />
              <p>{cartItems[id]}</p>
              <img
                className={isDisabled ? "disabled" : ""}
                onClick={!isDisabled ? handleAdd : undefined}
                src={assets.add_icon_green}
                alt=""
              />
            </div>
          )}
        </div>
        <div className="food-item-info">
          <div className="food-item-name-rating">
            <p>{name}</p>
            <img src={assets.rating_starts} alt="" />
          </div>
          <p className="food-item-desc">{description}</p>
          <p className="food-item-price">${price}</p>
        </div>
      </div>
    </>
  );
};

export default FoodItem;
