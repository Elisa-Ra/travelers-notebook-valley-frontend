import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Card, Collapse } from "react-bootstrap"
import Loading from "../components/Loading"
import Error from "../components/Error"
import Medaglie from "../components/ProfiloMedaglie"
import ProfiloModifica from "../components/ProfiloModifica"
import MyAlert from "./MyAlert"
import CollapseInfo from "./CollapseInfo"

export default function Profilo() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
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
      <MyAlert
        message={alertMessage}
        variant="success"
        onClose={() => setAlertMessage("")}
      />
      <Row className="justify-content-center">
        <ProfiloModifica
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          user={user}
          onSave={(updatedUser) => {
            setUser(updatedUser)
            setAlertMessage("Il tuo profilo è stato modificato con successo!")
          }}
        />
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
              Esci
            </button>
            <button className="wax mt-4" onClick={() => setShowEditModal(true)}>
              Modifica
            </button>
            <button className="wax mt-4" onClick={() => navigate("/diario")}>
              Diario
            </button>
          </div>
        </Col>
        <Col>
          {/* Lista delle medaglie (adesivi) dell'utente */}
          <CollapseInfo>
            <h4>Benvenuto nel tuo profilo, {user.username}!</h4>
            In questa pagina puoi modificare le tue informazioni, aprire il tuo
            diario del viaggiatore ed ammirare la tua collezione di adesivi!{" "}
            <br />
          </CollapseInfo>
          <Medaglie />
        </Col>
      </Row>
    </Container>
  )
}
