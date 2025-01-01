import React from "react";
import { LoadScript } from "@react-google-maps/api";
import { Navigate } from "react-router-dom";

const GoogleMapsLoader = ({ children }) => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyARGxaUcbKuvSeR9ok_RLJiHedU0xrj2oQ">
      {children}
    </LoadScript>
  );
};

export default GoogleMapsLoader;
