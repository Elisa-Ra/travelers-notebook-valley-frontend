import { useEffect, useState } from "react"
import { Container, Row, Col, ListGroup, Card, Badge } from "react-bootstrap"
import { BsCompassFill } from "react-icons/bs"
import { API_URL } from "../api"

export default function Esplora() {
  const [monumenti, setMonumenti] = useState([])
  const [selected, setSelected] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const fetchMonumenti = async () => {
      setIsLoading(true)
      setIsError(false)

      try {
        const res = await fetch(`${API_URL}/monumento`)
        if (!res.ok)
          throw new Error(
            "Ops, si è verificato un errore nel caricamento dei monumenti!",
          )

        const data = await res.json()
        setMonumenti(data)

        // Seleziono il primo di default
        if (data.length > 0) setSelected(data[0])
      } catch (error) {
        console.log(error)
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMonumenti()
  }, [])

  return (
    <Container fluid className="my-3 px-5">
      <Row>
        {/* COLONNA SINISTRA — Lista dei monumenti */}
        <Col xs={12} md={4} className="mx-auto mb-5">
          <h2 className="handwritten text-center mb-0 py-2 bg-oro">Luoghi</h2>

          {isLoading && <p>Sto caricando i luoghi da esplorare...</p>}
          {isError && (
            <p>
              Ops, c'è stato un errore nel caricamento dei luoghi da esplorare.
            </p>
          )}

          <ListGroup variant="flush" className="lista-monumenti">
            {monumenti.map((m) => (
              <ListGroup.Item
                key={m.id}
                action
                onClick={() => setSelected(m)}
                className={`pointer py-3 ${
                  selected?.id === m.id ? "selected-monumento" : ""
                }`}
              >
                <span className="fs-5">{m.nome}</span>
                <br />
                <small className="oro">{m.nomeCategoria}</small>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* COLONNA DESTRA — Dettaglio dei monumenti */}
        <Col xs={12} md={8} className="mx-auto">
          {selected ? (
            <div className="dettaglio-monumento page-background px-5 py-3">
              <h2 className="handwritten mb-3 fs-1">{selected.nome}</h2>

              <Card className="shadow-sm mb-4 mt-4 card-monumento">
                {selected.foto ? (
                  <Card.Img
                    src={selected.foto}
                    alt={selected.nome}
                    className="img-fluid"
                  />
                ) : (
                  <div className="placeholder-foto d-flex flex-column justify-content-center align-items-center">
                    <p className="fs-4 mb-1">Immagine non disponibile</p>
                    <p className="text-muted">
                      Stiamo scattando la foto di questo luogo
                    </p>
                  </div>
                )}
              </Card>
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3">
                <h4 className="oro fw-bold mb-0">
                  <Badge bg="warning">{selected.nomeCategoria}</Badge>
                </h4>

                <p className="text-muted mb-0 mt-2 mt-md-0">
                  <BsCompassFill className="me-2" size={18} color="#1b8b32" />
                  {selected.posizione}
                </p>
              </div>

              <p className="mt-3 fs-3">{selected.descrizione}</p>
            </div>
          ) : (
            <p className="text-center mt-5">Seleziona un luogo da esplorare.</p>
          )}
        </Col>
      </Row>
    </Container>
  )
}
