import { useState } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {Login} from "./Components/Login";

import {SignUp} from "./Components/Signup";
import {Home} from "./Components/Home";
import { Navbar } from "./Components/Navbar";

import {Userprofile} from "./Components/Userprofile";
import ProtectedRoute from "./ProtectedRoute";



function App() {
  const [count, setCount] = useState(0)
  

  return (
    <>
     <BrowserRouter>
            <Navbar/>                                              
            
              <Routes>
                  
                  <Route path="/login" element={<Login  />}></Route>
                  <Route path="/signup" element={ <SignUp  />}></Route> 

                  <Route path="/home" element={<ProtectedRoute component={Home} />} />
                  <Route path="/userprofile" element={<ProtectedRoute component={Userprofile} />} />
                  
                  <Route path="*" element={<Navigate to="/login" />} />

              </Routes>
          </BrowserRouter>  
     
    </>
  )
}

export default App
