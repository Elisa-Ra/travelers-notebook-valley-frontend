import "./App.css"
import Home from "./components/Home"
import Login from "./components/Login"
import MyFooter from "./components/MyFooter"
import MyNavbar from "./components/MyNavbar"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Register from "./components/Register"
import Profilo from "./components/Profile"
import Esplora from "./components/Esplora"
import Admin from "./components/Admin"
import Diario from "./components/Diario.jsx"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "./redux/store/authSlice"
import ProtectedRoute from "./components/ProtectedRoute.jsx"

function App() {
  const dispatch = useDispatch()
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    // se l'utente non è loggato non c'è il token quindi non faccio nulla
    if (!token) return

    // se il token c'è, viene controllato per restituire l'utente
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:3001/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          // redux viene aggiornato con i dati dell'utente
          dispatch(setUser(data))
        }
      } catch (err) {
        console.error("Ops, c'è stato un errore nel recuperare l'utente.", err)
      }
    }

    // l'effetto si attiva quando il token cambia (login o refresh)
    fetchUser()
  }, [token, dispatch])

  return (
    <BrowserRouter>
      <MyNavbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Le route del profilo e del diario appaiono solo agli utenti loggati */}
          <Route
            path="/profilo"
            element={
              <ProtectedRoute>
                <Profilo />
              </ProtectedRoute>
            }
          />
          <Route
            path="/diario"
            element={
              <ProtectedRoute>
                <Diario />
              </ProtectedRoute>
            }
          />

          <Route path="/esplora" element={<Esplora />} />

          {/* La route del pannello amministratore appare solo agli utenti con ruolo ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="ADMIN">
                <Admin />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <MyFooter />
    </BrowserRouter>
  )
}

export default App
