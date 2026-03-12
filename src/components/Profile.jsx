import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card } from "react-bootstrap"
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
    <Container className="profile-layout my-3 page-background p-4">
      <Row className="justify-content-center">
        <Col xs={12} sm={4} md={4} lg={4} className="profile">
          {/* Se l'avatar esiste, lo mostro */}
          {user.avatar && (
            <Card className="polaroid-card my-3 mx-auto">
              <Card.Img
                variant="top"
                src={user.avatar}
                className="polaroid-img"
              />
              <Card.Body className="text-center">
                <Card.Text className="polaroid-caption handwritten">
                  <strong>{user.username}</strong> <br />
                  Inizio del viaggio{" "}
                  {new Date(user.dataRegistrazione).toLocaleDateString()}
                </Card.Text>
              </Card.Body>
            </Card>
          )}

          <p className="handwritten"></p>
          <div className="mb-2 d-flex justify-content-between">
            <button className="wax mt-4" onClick={logout}>
              Logout
            </button>
            <button className="wax mt-4" onClick={() => navigate("/diario")}>
              Diario
            </button>
          </div>
        </Col>
        <Col>
          {/* Lista delle medaglie dell'utente */}
          <Medaglie />
        </Col>
      </Row>
    </Container>
  )
}
