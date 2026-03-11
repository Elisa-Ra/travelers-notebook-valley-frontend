import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import Loading from "../components/Loading"
import Error from "../components/Error"
import Medaglie from "../components/ProfiloMedaglie"

export default function Profilo() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const logout = () => {
    localStorage.removeItem("token")
    navigate("/login")
  }

  useEffect(() => {
    const token = localStorage.getItem("token")

    // se il token non è presente, reindirizzo alla pagina di login
    if (!token) {
      navigate("/login")
      return
    }

    const fetchUser = async () => {
      try {
        const response = await fetch("http://localhost:3001/auth/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          setIsError(true)
          return
        }

        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.log(error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUser()
  }, [navigate])

  if (isLoading) return <Loading />
  if (isError) return <Error />

  return (
    <Container fluid className="profile-layout mt-3">
      <Row className="justify-content-center">
        <Col xs={12} sm={4} md={4} lg={4} className="page-background profile">
          {/* Se l'avatar esiste, lo mostro */}
          {user.avatar && (
            <div className="my-3 text-center">
              <img
                src={user.avatar}
                alt="Avatar"
                className="avatar-img border border-black"
              />
            </div>
          )}

          <p className="handwritten">
            <strong>Username:</strong> {user.username}
          </p>
          <p className="handwritten">
            <strong>Email:</strong> {user.email}
          </p>

          <p className="handwritten">
            <strong>Registrato il:</strong>{" "}
            {new Date(user.dataRegistrazione).toLocaleDateString()}
          </p>
          {/* Lista delle medaglie dell'utente */}
          <Medaglie />
        </Col>
      </Row>
      <Row>
        <Col className="mx-auto text-center mb-2">
          <button className="wax mt-4" onClick={() => navigate("/diario")}>
            Diario
          </button>
          <button className="wax mt-4" onClick={logout}>
            Logout
          </button>
        </Col>
      </Row>
    </Container>
  )
}
