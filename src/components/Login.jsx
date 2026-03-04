import { useState } from "react"
import { useNavigate } from "react-router-dom"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Loading from "./Loading"
import Error from "./Error"
import bg from "../assets/page-bg.svg"

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    setIsLoading(true)
    setIsError(false)

    try {
      const res = await fetch("http://localhost:3001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Ops, c'è stato un errore nel login.")

      const data = await res.json()
      console.log("Login riuscito:", data)

      // Salvo il token
      localStorage.setItem("token", data.token)

      // Reindirizzo alla home
      navigate("/home")
    } catch (error) {
      console.log(error)
      setIsError(true)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div
        className="page-bg"
        style={{
          backgroundImage: `url(${bg})`,
        }}
      >
        {isLoading && <Loading />}
        {isError && <Error />}
        <p className="h3">Il mio taccuino del viaggiatore</p>
        <Form className="handwritten form-content" onSubmit={handleSubmit}>
          <Form.Group className="mb-3 fs-4" controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Inserisci email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Accedi
          </Button>
        </Form>
      </div>
    </div>
  )
}
