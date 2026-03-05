import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import Loading from "../components/Loading"
import Error from "../components/Error"

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

    // se non c’è token → torna al login
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
    <Container fluid className="profile-layout">
      <Row className="justify-content-center">
        <Col xs={12} md={6} className="handwritten profile-card">
          <h2 className="mb-4">Il mio profilo</h2>

          <p>
            <strong>Username:</strong> {user.username}
          </p>
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Ruolo:</strong> {user.ruolo}
          </p>
          <p>
            <strong>Registrato il:</strong>{" "}
            {new Date(user.dataRegistrazione).toLocaleDateString()}
          </p>

          {user.avatar && (
            <div className="mt-3">
              <img src={user.avatar} alt="Avatar" className="avatar-img" />
            </div>
          )}

          <button className="wax mt-4" onClick={() => navigate("/")}>
            Torna al taccuino
          </button>
          <button className="wax mt-4" onClick={logout}>
            Logout
          </button>
        </Col>
      </Row>
    </Container>
  )
}
