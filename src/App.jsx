import "./App.css"
import Home from "./components/Home"
import Login from "./components/Login"
import MyFooter from "./components/MyFooter"
import MyNavbar from "./components/MyNavbar"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./components/Register"
import Profilo from "./components/Profile"
import Esplora from "./components/Esplora"

function App() {
  return (
    <>
      <BrowserRouter>
        <MyNavbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profilo" element={<Profilo />} />
            <Route path="/esplora" element={<Esplora />} />
          </Routes>
        </main>
        <MyFooter />
      </BrowserRouter>
    </>
  )
}

export default App
