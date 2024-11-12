import { useState } from 'react'

import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {Login} from "./Components/Login";

import {SignUp} from "./Components/SignUp";
import {Home} from "./Components/Home";
import { Navbar } from "./Components/Navbar";



function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <BrowserRouter>
            <Navbar/>
              <Routes>
                  <Route path="/home" element={<Home />}> </Route>
                  <Route path="/login" element={<Login  />}></Route>
                  <Route path="/signup" element={ <SignUp  />}></Route> 
              </Routes>
          </BrowserRouter>  
     
    </>
  )
}

export default App
