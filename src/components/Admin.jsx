import { useSelector, useDispatch } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, ListGroup } from "react-bootstrap"
import Loading from "../components/Loading"
import Error from "../components/Error"
import Categorie from "./GestioneCategorie"
import Monumenti from "./GestioneMonumenti"
import Medaglie from "./GestioneMedaglie"
import { logout } from "../redux/store/authSlice"

export default function Admin() {
  const navigate = useNavigate()
  const dispatch = useDispatch() // per inviare azioni a redux

  // leggo i dati globali da redux  (l'user ed il token)
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)

  // sezione da mostrare
  const [section, setSection] = useState("monumenti")

  useEffect(() => {
    // Se il token non c'è, si viene reindirizzati alla pagina di login
    if (!token) {
      navigate("/login")
      return
    }

    // Se l'user non è ancora stato caricato ma il token sì, aspettiamo
    if (!user) return

    // Se l'utente loggato non è un admin, viene reindirizzato alla home
    if (user.ruolo !== "ADMIN") {
      navigate("/")
      return
    }
  }, [token, user, navigate])

  // faccio apparire la barra di caricamente finché non ho lo user
  if (!user) return <Loading />

  // Se l'user non ha il ruolo admin, faccio apparire l'errore
  if (user.ruolo !== "ADMIN") return <Error />

  // LOGOUT, (da authSlice) rimuove token ed user e reindirizza alla pagina di login
  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <Container fluid className="profile-layout page-background">
      <Row>
        {/* MENU LATERALE */}
        <Col
          xs={12}
          md={4}
          className="bg-white p-3 d-flex flex-column admin-sidebar"
        >
          <div className="flex-grow-1">
            <h3 className="mb-4">Pannello amministratore</h3>

            <ListGroup variant="flush" className="lista-monumenti">
              <ListGroup.Item
                action
                onClick={() => setSection("monumenti")}
                className={`lista ${section === "monumenti" ? "active-lista" : ""}`}
              >
                Monumenti
              </ListGroup.Item>

              <ListGroup.Item
                action
                onClick={() => setSection("categorie")}
                className={`lista ${section === "categorie" ? "active-lista" : ""}`}
              >
                Categorie
              </ListGroup.Item>
              <ListGroup.Item
                action
                onClick={() => setSection("medaglie")}
                className={`lista ${section === "medaglie" ? "active-lista" : ""}`}
              >
                Medaglie
              </ListGroup.Item>
            </ListGroup>
          </div>

          <div className="d-flex justify-content-between align-items-center">
            <p className="mb-0 handwritten fs-2">{user.username}</p>

            <button className="wax" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </Col>

        {/* CONTENUTO CENTRALE */}
        <Col xs={12} md={8} className="page-background p-4">
          {section === "categorie" && <Categorie />}
          {section === "monumenti" && <Monumenti />}
          {section === "medaglie" && <Medaglie />}
        </Col>
      </Row>
    </Container>
  )
}
