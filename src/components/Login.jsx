import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { loginSuccess, setUser } from "../redux/store/authSlice"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Loading from "./Loading"
import ErrorMessage from "./Error"
import bg from "../assets/page-bg.svg"

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch() // per inviare azioni a redux

  // stati locali collegati al form
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  // gli stati per il loader e il messaggio di errore
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    // evito il comportamento di default del form, ovvero ricaricare la pagina
    e.preventDefault()

    setIsLoading(true)
    setIsError(false)

    // chiamata di login al backend
    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      // se la risposta non va bene, messaggio di errore
      if (!res.ok) throw new Error("Ops, c'è stato un errore nel login.")

      // se tutto va bene, prendo i dati
      const data = await res.json()

      // Aggiorno redux con il token di accesso
      dispatch(loginSuccess({ token: data.accessToken }))
      const meRes = await fetch("http://localhost:3001/utenti/me", {
        headers: {
          Authorization: `Bearer ${data.accessToken}`,
        },
      })

      if (!meRes.ok) throw new Error("Impossibile recuperare il profilo")

      const user = await meRes.json()

      // 4) Salvo l’utente in Redux
      dispatch(setUser(user))

      // 5) Redirect in base al ruolo
      if (user.ruolo === "ADMIN") navigate("/admin")
      else navigate("/profilo")
    } catch (error) {
      console.log(error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      {isLoading && <Loading />}
      {isError && <ErrorMessage />}
      <div
        className="page-bg pt-5 px-4"
        style={{ backgroundImage: `url(${bg})` }}
      >
        <p className="h3 text-center mb-5">Il mio taccuino del viaggiatore</p>

        <Form className="form-content flex-grow-1" onSubmit={handleSubmit}>
          <Form.Group className="mb-3 fs-4" controlId="formBasicEmail">
            <Form.Label>Posta elettronica</Form.Label>
            <Form.Control
              type="email"
              placeholder="Inserisci email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="handwritten"
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="handwritten"
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Accedi
          </Button>
        </Form>

        <p className="handwritten mt-3 text-center">
          Non hai ancora un taccuino?
          <span
            className="link ms-2 pointer oro"
            onClick={() => navigate("/register")}
          >
            Parti da qui
          </span>
        </p>
      </div>
    </div>
  )
}
