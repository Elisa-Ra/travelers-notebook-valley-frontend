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
    <Container fluid className="profile-layout mt-3 ">
      <h2 className="text-center">
        Benvenuto nel tuo diario di viaggio, {user.username}!
      </h2>
      {/* componente con le istruzioni del diario */}
      <Istruzioni />
      <Row className="justify-content-center ">
        {" "}
        {/* Componente per scrivere un nuovo post (pagina) */}
        <Pagina user={user} />
        {/* Lista dei post */}
        <Posts />
      </Row>
    </Container>
  )
}
