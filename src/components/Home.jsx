import { Container, Row, Col } from "react-bootstrap"
import Gallery from "./Gallery"
import tempioEra from "../assets/img/bg-era1.jpg"
import tempioDioscuri from "../assets/img/wdioscuri.jpg"
import tempioZeus from "../assets/img/wzeus.jpg"
import tempioConcordia from "../assets/img/bg-tempio.jpg"
import tempioErcole from "../assets/img/weracle.jpg"
import { Link } from "react-router-dom"

export default function Home() {
  // POLAROID
  const images = [
    { src: tempioEra, alt: "Tempio di Era" },
    { src: tempioDioscuri, alt: "Tempio dei Dioscuri" },
    { src: tempioZeus, alt: "Tempio di Zeus" },
    { src: tempioConcordia, alt: "Tempio della Concordia" },
    { src: tempioErcole, alt: "Tempio di Ercole" },
  ]

  return (
    <>
      {/* HERO SECTION */}

      <div className="hero-split">
        <div className="hero-text">
          <h1 className="handwritten">Traveller's Notebook - Valley Edition</h1>
          <p className="fs-3 text-center">Ogni viaggio inizia da una pagina.</p>
        </div>

        <div className="hero-image"></div>
      </div>

      {/* CITAZIONE */}
      <Container className="my-5 blockquote page-background-home">
        <figure className="text-center p-3 ">
          <blockquote className=" fs-1 handwritten pb-2">
            <q>
              Lo scopo di questo mio magnifico viaggio non è quello d'illudermi,
              bensì di conoscere me stesso nel rapporto con gli oggetti.
            </q>
          </blockquote>
          <figcaption className="blockquote-footer">
            Johann Wolfgang von Goethe
          </figcaption>
        </figure>
      </Container>

      {/* CONTAINER CHE RIMANDA ALLA PAGINA DEI MONUMENTI */}

      <Container className="text-center clickable-container my-5 py-2">
        <Link
          to="/esplora"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <p className="fs-1">Scopri dove ha inizio il tuo viaggio.</p>
          <Gallery images={images} />
          <p className="fs-4 mt-4"> Lasciati ispirare.</p>
        </Link>
      </Container>

      {/* CONTAINER CHE RIMANDA AL LOGIN */}

      <Container className="text-center clickable-container my-5 page-background-home p-3">
        <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
          <Row>
            <Col xs={12} md={9} className="text-center">
              <p className="fs-1">
                Inizia a scrivere nel tuo personale diario di viaggio.
              </p>
              <p className="fs-4">Accedi per iniziare.</p>
            </Col>

            <Col xs={12} md={3} className="text-center">
              <img
                src="src\assets\img\diario.svg"
                alt="Diario"
                className="diario"
              />
            </Col>
          </Row>
        </Link>
      </Container>
    </>
  )
}
