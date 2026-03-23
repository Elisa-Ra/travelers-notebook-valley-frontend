import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Form from "react-bootstrap/Form"
import Loading from "./Loading"
import Error from "./Error"
import { Container } from "react-bootstrap"
import { API_URL } from "../api"

export default function Register() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  })

  // errors è per gli errori di validazione del backend
  const [errors, setErrors] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  // isError invece è per le eccezioni o gli errori di rete
  const [isError, setIsError] = useState(false)
  const [isSuccess, setIsSuccess] = useState("")

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])
    setIsError(false)
    setIsSuccess("")
    setIsLoading(true)

    // fetch sull'endpoint di registrazione dell'utente
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await response.json()

      // Errori se la risposta non va bene
      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors)
        } else {
          setErrors([
            "Ops, c'è stato un errore nella registrazione al tuo diario di viaggio.",
          ])
        }
        setIsError(true)
        return
      }

      // Se la registrazione riesce
      console.log("La registrazione è avvenuta con successo:", data)
      setIsSuccess(
        "Complimenti! Adesso fai il login per iniziare la tua avventura!",
      )
      setForm({ username: "", email: "", password: "" })

      // Reindirizzo al login
      navigate("/login")
    } catch (error) {
      console.log(error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {isLoading && <Loading />}
      {isError && <Error />}

      <Container>
        <Container className="form-bg page-background pt-5 px-4">
          <p className="h3 text-center mb-5 handwritten">
            Il mio primo diario del viaggiatore
          </p>

          {errors.length > 0 && (
            <div className="alert alert-danger handwritten">
              {errors.map((err, i) => (
                <div key={i}>{err}</div>
              ))}
            </div>
          )}

          {isSuccess && (
            <div className="alert alert-success handwritten">{isSuccess}</div>
          )}

          <Form className="form-content" onSubmit={handleSubmit}>
            <Form.Group className="mb-3 fs-4" controlId="formBasicUsername">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Scrivi qui il tuo username"
                value={form.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 fs-4" controlId="formBasicEmail">
              <Form.Label>Indirizzo di posta</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Scrivi qui la tua email"
                value={form.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 fs-4" controlId="formBasicPassword">
              <Form.Label>Parola d'ordine</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Scrivi qui la tua password"
                value={form.password}
                onChange={handleChange}
              />
            </Form.Group>

            <div className="text-end">
              <button className="wax" type="submit">
                Registrati
              </button>
            </div>
          </Form>
        </Container>

        <p className="handwritten mt-3 text-center">
          Hai già un diario?
          <span
            className="link ms-2 pointer oro"
            onClick={() => navigate("/login")}
          >
            Accedi qui
          </span>
        </p>
      </Container>
    </>
  )
}
