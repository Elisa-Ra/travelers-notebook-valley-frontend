import { useSelector } from "react-redux" // hook di redux
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children, role }) {
  // leggo dallo stato globale di redux il valore dell'utente (se è null non è loggato)
  const user = useSelector((state) => state.auth.user)

  // se l'utente non è loggato, reindirizzo alla pagina di login
  // replace evita che l'utente usi il tasto per andare indietro
  if (!user) return <Navigate to="/login" replace />

  // se l'utente è loggato ma non ha il ruolo richiesto dalla route, viene reindirizzato alla home
  if (role && user.ruolo !== role) return <Navigate to="/" replace />

  // se va tutto bene (utente loggato e con il ruolo giusto), gli mostro la pagina richiesta
  return children
}
