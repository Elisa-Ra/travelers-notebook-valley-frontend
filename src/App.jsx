import "./App.css"
import Home from "./components/Home"
import Login from "./components/Login"
import MyFooter from "./components/MyFooter"
import MyNavbar from "./components/MyNavbar"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./components/Register"
import Profilo from "./components/Profile"

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="page-background">
          <MyNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="profilo" element={<Profilo />} />
          </Routes>
        </div>

        <MyFooter />
      </BrowserRouter>
    </>
  )
}

export default App
