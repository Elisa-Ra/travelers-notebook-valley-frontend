import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Container, Row, Col, Tabs, Tab } from "react-bootstrap"
import Loading from "../components/Loading"
import Error from "../components/Error"
import Categorie from "./GestioneCategorie"
import Monumenti from "./GestioneMonumenti"
import Medaglie from "./GestioneMedaglie"

export default function Admin() {
  const navigate = useNavigate()

  // leggo i dati globali da redux  (l'user ed il token)
  const user = useSelector((state) => state.auth.user)
  const token = useSelector((state) => state.auth.token)

  // sezione da mostrare
  const [section, setSection] = useState("categorie")

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

  return (
    <Container fluid className="profile-layout ">
      <Row>
        <Col xs={12} className="p-4">
          <h3 className="mb-4 text-center">Pannello amministratore</h3>

          <Tabs
            activeKey={section}
            onSelect={(k) => setSection(k)}
            className="tabs-linguette"
            justify
          >
            <Tab eventKey="categorie" title="Categorie" />
            <Tab eventKey="medaglie" title="Medaglie" />
            <Tab eventKey="monumenti" title="Monumenti" />
          </Tabs>

          {section === "categorie" && <Categorie />}
          {section === "medaglie" && <Medaglie />}
          {section === "monumenti" && <Monumenti />}
        </Col>
      </Row>
    </Container>
  )
}
