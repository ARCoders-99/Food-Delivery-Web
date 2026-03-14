import React, { useState, useContext } from 'react';
import { StoreContext } from '../../../Context/StoreContext';
import "./Home.css"
import Header from '../../Header/Header'
import ExploreMenu from '../../Explore Menu/ExploreMenu'
import FoodDisplay from '../../FoodDisplay/FoodDisplay';
import AppDownload from '../../AppDownload/AppDownload';

const Home = () => {
  const [category, setcategory] = useState("All")
  const { searchTerm } = useContext(StoreContext);

  return (
    <div>
      {!searchTerm && <Header/>}
      {!searchTerm && <ExploreMenu category={category} setcategory={setcategory}/>}
      <FoodDisplay category = {category}/>
      {!searchTerm && <AppDownload/>}
    </div>
  )
}

export default Home