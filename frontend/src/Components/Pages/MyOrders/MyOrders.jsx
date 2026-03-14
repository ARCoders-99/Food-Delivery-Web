import React, { useContext, useEffect, useState } from 'react';
import './MyOrders.css';
import { StoreContext } from '../../../Context/StoreContext';
import axios from 'axios';
import { assets } from '../../../assets/assets';

const MyOrders = () => {
    const { url, token } = useContext(StoreContext);
    const [data, setData] = useState([]);

    const fetchOrders = async () => {
        const response = await axios.post(url + "/api/order/userorders", {}, { headers: { Authorization: `Bearer ${token}` } });
        if (response.data.success) {
            setData(response.data.data);
        }
    }

    useEffect(() => {
        if (token) {
            fetchOrders();
        }
    }, [token]);

    return (
        <div className='my-orders'>
            <h2>My Orders</h2>
            
            <div className="container">
                <h3>Active Orders</h3>
                {data.filter(order => order.status !== "Delivered").length > 0 ? (
                    data.filter(order => order.status !== "Delivered").map((order, index) => (
                        <div key={index} className="my-orders-order">
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items?.map((item, idx) => {
                                if (idx === order.items.length - 1) {
                                    return item.name + " x " + item.quantity
                                } else {
                                    return item.name + " x " + item.quantity + ", "
                                }
                            })}</p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items?.length}</p>
                            <p>
                                <span className={
                                    order.status === "Food Processing" ? "status-processing" : 
                                    order.status === "Out for delivery" ? "status-out" : 
                                    order.status === "Delivered" ? "status-delivered" : ""
                                }>&#x25cf;</span> 
                                <b className={
                                    order.status === "Food Processing" ? "status-processing" : 
                                    order.status === "Out for delivery" ? "status-out" : 
                                    order.status === "Delivered" ? "status-delivered" : ""
                                }>{order?.status}</b>
                            </p>
                            <div className="order-track-visual">
                                <div className={`dot ${order.status==="Food Processing" || order.status==="Out for delivery" || order.status==="Delivered" ? "active" : ""}`}></div>
                                <div className={`line ${order.status==="Out for delivery" || order.status==="Delivered" ? "active" : ""}`}></div>
                                <div className={`dot ${order.status==="Out for delivery" || order.status==="Delivered" ? "active" : ""}`}></div>
                                <div className={`line ${order.status==="Delivered" ? "active" : ""}`}></div>
                                <div className={`dot ${order.status==="Delivered" ? "active" : ""}`}></div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-orders-msg">No active orders at the moment.</p>
                )}

                <h3 className="past-orders-title">Past Orders</h3>
                {data.filter(order => order.status === "Delivered").length > 0 ? (
                    data.filter(order => order.status === "Delivered").map((order, index) => (
                        <div key={index} className="my-orders-order recent-order">
                            <img src={assets.parcel_icon} alt="" />
                            <p>{order.items?.map((item, idx) => {
                                if (idx === order.items.length - 1) {
                                    return item.name + " x " + item.quantity
                                } else {
                                    return item.name + " x " + item.quantity + ", "
                                }
                            })}</p>
                            <p>${order.amount}.00</p>
                            <p>Items: {order.items?.length}</p>
                            <p>
                                <span className="status-delivered">&#x25cf;</span> 
                                <b className="status-delivered">{order?.status}</b>
                            </p>
                            <div className="past-order-status-visual">
                                <span className="status-delivered">&#x2713;</span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="no-orders-msg">You haven't completed any orders yet.</p>
                )}
            </div>
        </div>
    )
}

export default MyOrders;
