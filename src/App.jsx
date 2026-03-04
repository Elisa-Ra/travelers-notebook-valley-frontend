import "./App.css"
import Home from "./components/Home"
import Login from "./components/Login"
import MyFooter from "./components/MyFooter"
import MyNavbar from "./components/MyNavbar"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="page-background">
          <MyNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>

        <MyFooter />
      </BrowserRouter>
    </>
  )
}

export default App
