import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Loading from "./Loading"
import Error from "./Error"
import bg from "../assets/page-bg.svg"
import { Col, Container, Row } from "react-bootstrap"

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
      const response = await fetch("http://localhost:3001/auth/register", {
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
            "Ops, c'è stato un errore nella registrazione al tuo taccuino di viaggio.",
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
      <Container fluid className="register-layout">
        {/* COLONNA MESSAGGI (fuori dalla pagina) */}
        <Row className="messages-row px-3">
          <Col xs={12} md={4} className="messages-col">
            {isLoading && <Loading />}
            {isError && <Error />}

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
          </Col>
        </Row>

        {/* PAGINA DEL TACCUINO (form dentro) */}
        <Container
          className="leather-bg"
          style={{ backgroundImage: `url(${bg})` }}
        >
          <p className="h3">Il mio taccuino del viaggiatore</p>

          <Form className="handwritten form-content" onSubmit={handleSubmit}>
            <Form.Group className="mb-3 fs-4" controlId="formBasicUsername">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                placeholder="Inserisci l'username"
                value={form.username}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3 fs-4" controlId="formBasicEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder="Inserisci email"
                value={form.email}
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </Form.Group>

            <button className="wax" type="submit">
              Registrati
            </button>
          </Form>
        </Container>
      </Container>

      <Container>
        <p className="handwritten mt-3">
          Hai già un taccuino?
          <span className="link" onClick={() => navigate("/login")}>
            Accedi qui
          </span>
        </p>
      </Container>
    </>
  )
}
