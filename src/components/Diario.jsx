import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import Loading from "./Loading"
import Error from "./Error"
import Istruzioni from "./Istruzioni"
import Pagina from "./PaginaDiario"
import Posts from "./PostDiario"

export default function Profilo() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  const [refreshPosts, setRefreshPosts] = useState(false)

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
    <Container fluid className="mt-3 px-0">
      <Row className="justify-content-center gx-0">
        {/* Colonna vuota sinistra */}
        <Col xs={0} md={2} lg={3} className="p-0"></Col>

        {/* COLONNA CENTRALE */}
        <Col xs={12} md={8} lg={6} className="px-3">
          <div style={{ maxWidth: "100%", overflowX: "hidden" }}>
            <h2 className="text-center">
              Benvenuto nel tuo diario di viaggio, {user.username}!
            </h2>
            {/* Istruzioni sul diario */}
            <Istruzioni />
            {/* Form per aggiungere un post (pagina) */}
            <Pagina
              user={user}
              onPostCreated={() => setRefreshPosts(!refreshPosts)}
            />
            {/* Lista dei post presenti */}
            <Posts refresh={refreshPosts} />
          </div>
        </Col>

        {/* Colonna vuota destra */}
        <Col xs={0} md={2} lg={3} className="p-0"></Col>
      </Row>
    </Container>
  )
}
