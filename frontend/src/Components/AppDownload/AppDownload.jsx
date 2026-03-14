import React, { useState } from "react";
import "./AppDownload.css";
import { assets } from "../../assets/assets";
import ComingSoonModal from "./ComingSoonModal";

const AppDownload = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="app-download" id="app-download">
      <ComingSoonModal show={showModal} onClose={() => setShowModal(false)} />
      <div className="app-download-content">
        <div className="app-download-text">
          <h1>For Better Experience Download <br /> <span>Tomato</span> App</h1>
          <p>Get our app for exclusive deals, faster ordering, and real-time tracking of your favorite meals. Your hunger, delivered fast!</p>
          <div className="app-download-platforms">
            <img onClick={() => setShowModal(true)} src={assets.play_store} alt="Play Store" style={{ cursor: 'pointer' }} />
            <img onClick={() => setShowModal(true)} src={assets.app_store} alt="App Store" style={{ cursor: 'pointer' }} />
          </div>
        </div>
        <div className="app-download-image">
          <img src={assets.app_mockup} alt="App Mockup" />
        </div>
      </div>
    </div>
  );
};

export default AppDownload;
