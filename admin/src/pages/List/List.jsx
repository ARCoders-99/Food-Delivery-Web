import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "./List.css"

const List = ({url}) => {
  const [list, setList] = useState([]);
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/food/list`);
    console.log(response.data);
    if (response.data.success) {
      setList(response.data.data);
    } else {
      toast.error("Error");
    }
  };

const removeFood = async(foodId)=>{
 const response = await axios.post(`${url}/api/food/remove`, {id:foodId}) 
 await fetchList()
 if (response.data.success) {
  toast.success(response.data.message)
 } else {
  toast.error("Error")
 }
 
}

  useEffect(() => {
    fetchList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="list add flex-col">
      <p>ALL Foods List</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="list-table-format">
              <img
                src={`${url}/images/${item.image}`}
                alt={item.name}
                className="food-image"
              />
              <p>{item.name}</p>
              <p>{item.category}</p>
              <p>{item.price}</p>
              <p  onClick={()=>removeFood(item._id)} className="cursor">x</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
