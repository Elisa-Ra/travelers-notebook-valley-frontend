import { Container } from "react-bootstrap"
import Gallery from "./Gallery"
import reactLogo from "../assets/img/react.svg"
import { Link } from "react-router-dom"

export default function Home() {
  // METTERE MINI POLAROID TEMPLI
  const images = [
    { src: reactLogo, alt: "Img1" },
    { src: reactLogo, alt: "Img2" },
    { src: reactLogo, alt: "Img3" },
    { src: reactLogo, alt: "Img4" },
    { src: reactLogo, alt: "Img5" },
  ]

  return (
    <>
      <h1 className="text-center mt-4">
        TRAVELLER'S NOTEBOOK - VALLEY EDITION
      </h1>

      {/* <p className="h2 text-center">Benvenuto nel tuo taccuino di viaggio!</p> */}

      <Gallery images={images} />
      <Container className="page">
        <figure className="text-center">
          <blockquote className="blockquote fs-1 handwritten">
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
      {/* METTERE BACKGROUND TEMPIO VALLE */}
      {/* CONTAINER CHE RIMANDA ALLA PAGINA DEI MONUMENTI */}
      <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
        <Container className="text-center clickable-container">
          <p className="fs-1">Scopri dove ha inizio il tuo prossimo viaggio.</p>
          <p className="fs-4"> Ogni luogo è una pagina da scrivere.</p>
        </Container>
      </Link>

      {/* CONTAINER CHE RIMANDA AL LOGIN */}
      <Link to="/login" style={{ textDecoration: "none", color: "inherit" }}>
        <Container className="text-center clickable-container">
          <p className="fs-1">Scrivi i tuoi ricordi, un luogo alla volta.</p>
          <p className="fs-4">Accedi per iniziare.</p>
        </Container>
      </Link>
    </>
  )
}
