import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useCallback } from "react";
//eslint-disable-next-line react-refresh/only-export-components
export const StoreContext = createContext({ food_list: [] });

const url = "https://food-delivery-backend-ryy8.onrender.com";

const StoreContextProvider = (props) => {
  const [cartItems, setcartItems] = useState({});
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // use null instead of {}
  const [food_list, setFoodList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showLogin, setshowLogin] = useState(false);
  const [hasActiveOrders, setHasActiveOrders] = useState(false);

  const addToCart = async (itemId) => {
    if (!cartItems[itemId]) {
      setcartItems((prev) => ({ ...prev, [itemId]: 1 }));
    } else {
      setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] + 1 }));
    }

    if (token) {
      await axios.post(
        url + "/api/cart/add",
        { itemId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }
  };

  const removeFromCart = async (itemId) => {
    if (cartItems[itemId] > 1) {
      setcartItems((prev) => ({ ...prev, [itemId]: prev[itemId] - 1 }));
    } else {
      setcartItems((prev) => {
        const updatedCart = { ...prev };
        delete updatedCart[itemId];
        return updatedCart;
      });
    }

    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } catch (err) {
        console.error("Failed to remove item from backend cart:", err);
      }
    }
  };

  const loadCartData = async (token) => {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setcartItems(response.data.cartData);
  };

  const checkActiveOrders = async () => {
    if (token) {
      try {
        const response = await axios.post(
          url + "/api/order/userorders",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (response.data.success) {
          const active = response.data.data.some((order) => order.status !== "Delivered");
          console.log(`[DEBUG] Orders Found: ${response.data.data.length}, Active orders present: ${active}`);
          setHasActiveOrders(active);
        }
      } catch (error) {
        console.error("Error checking active orders:", error);
      }
    }
  };

  useEffect(() => {
    if (token) {
      checkActiveOrders();
      const interval = setInterval(checkActiveOrders, 30000); 
      return () => clearInterval(interval);
    } else {
      setHasActiveOrders(false);
    }
  }, [token]);
const getTotalCartAmount = useCallback(() => {
  let totalAmount = 0;
  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      let itemInfo = food_list.find(
        (product) => String(product._id) === String(item)
      );
      if (itemInfo) {
        totalAmount += itemInfo.price * cartItems[item];
      }
    }
  }
  return totalAmount;
}, [cartItems, food_list]);

const getTotalCartItems = useCallback(() => {
  let totalItems = 0;
  for (const item in cartItems) {
    if (cartItems[item] > 0) {
      totalItems += cartItems[item];
    }
  }
  return totalItems;
}, [cartItems]);
  const fetchFoodList = async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (err) {
      console.error("Failed to fetch food list:", err);
    }
  };

  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        setToken(tokenString);
        setUser({ _id: "your_user_id_here" }); // replace with real user
        await loadCartData(tokenString);
      }
    }
    loadData();
  }, []);

  const contextValue = {
    food_list,
    cartItems,
    setcartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    getTotalCartItems,
    setToken,
    token,
    url,
    user,
    searchTerm,
    setSearchTerm,
    showLogin,
    setshowLogin,
    hasActiveOrders,
    checkActiveOrders
  };

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreContextProvider;
