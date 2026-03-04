import { Container } from "react-bootstrap"
import Gallery from "./Gallery"
import reactLogo from "../assets/img/react.svg"
import MyFooter from "./MyFooter"

export default function Home() {
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
      <p className="h2 text-center">
        Benvenuto nel tuo taccuino del viaggiatore!
      </p>

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
      <MyFooter />
    </>
  )
}
