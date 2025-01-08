import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoadScript } from "@react-google-maps/api";

import { Login } from "./Components/Login";
import { SignUp } from "./Components/Signup";
import { Home } from "./Components/Home";
import { Navbar } from "./Components/Navbar";
import { Userprofile } from "./Components/Userprofile";
import { TravelPlan } from "./Components/TravelPlan"; 
import { Savedplan}  from "./Components/Savedplan"; 
import ProtectedRoute from "./ProtectedRoute";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <LoadScript googleMapsApiKey="AIzaSyARGxaUcbKuvSeR9ok_RLJiHedU0xrj2oQ" libraries={["places"]}>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/home" element={<ProtectedRoute component={Home} />} />
            <Route path="/userprofile" element={<ProtectedRoute component={Userprofile} />} />
            <Route path="/travelplan" element={<ProtectedRoute component={TravelPlan} />} />
            <Route path="/savedplan" element={<ProtectedRoute component={Savedplan} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        </BrowserRouter>
      </LoadScript>
    </>
  );
}

export default App;