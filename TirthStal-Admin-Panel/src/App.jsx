import React, { useDebugValue, useState } from 'react'
import {BrowserRouter , Routes , Route} from "react-router-dom"
import MainPage from './Pages/MainPage/MainPage'
import Temple from "./Components/Temple/temple"
import Dieties from "./Components/Dieties/dieties"
import Festivals from "./Components/Festivals/festivals"
import Dashboard from './Components/Dashboard/dashboard'
function App () {
  
  return ( 
    
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainPage/>}>
          <Route path="dashboard" element={<Dashboard/>}/>
           <Route path="temple" element={<Temple/>}/>  
           <Route path='dieties'   element={<Dieties/>}/>   
           <Route path='/festivals' element={<Festivals/>}/>
          </Route>
          </Routes>
        
      </BrowserRouter>
    </div>
  )
}

export default App