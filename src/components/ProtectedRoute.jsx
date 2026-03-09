import { useSelector } from "react-redux" // hook di redux
import { Navigate } from "react-router-dom"
import Loading from "./Loading"

export default function ProtectedRoute({ children, role }) {
  // leggo dallo stato globale di redux il valore dell'utente (se è null non è loggato)
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)

  // Se non è presente il token, l'utente non è loggato e lo reindirizzo alla pagina di login
  if (!token) return <Navigate to="/login" replace />

  // Se il token c'è ma l'user ancora no, parte un loading per aspettare
  if (token && !user) return <Loading />

  // se l'utente è loggato ma non ha il ruolo richiesto dalla route, viene reindirizzato alla home
  if (role && user.ruolo !== role) return <Navigate to="/" replace />

  // se va tutto bene (utente loggato e con il ruolo giusto), gli mostro la pagina richiesta
  return children
}
