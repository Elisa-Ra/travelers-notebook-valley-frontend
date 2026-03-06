import { useEffect, useState } from "react"
import { Container, Row, Col, ListGroup, Card } from "react-bootstrap"

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
        const res = await fetch("http://localhost:3001/monumento")
        if (!res.ok)
          throw new Error("Ops, si è verificato un errore nel caricamento!")

        const data = await res.json()
        setMonumenti(data)

        // Seleziono il primo
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
    <Container fluid className="my-3">
      <Row>
        {/* COLONNA SINISTRA — Lista dei monumenti */}
        <Col xs={12} md={4} className="border-end pe-0 ">
          <h2 className="handwritten text-center mb-0 pb-2 bg-oro">Luoghi</h2>

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
        <Col xs={12} md={8} className="ps-4">
          {selected ? (
            <div className="dettaglio-monumento">
              <h2 className="handwritten mb-3">{selected.nome}</h2>

              <Card className="shadow-sm mb-4">
                <Card.Img
                  src={selected.foto}
                  alt={selected.nome}
                  className="img-fluid"
                />
              </Card>

              <p className="oro fw-bold">{selected.nomeCategoria}</p>
              <p className="text-muted">{selected.posizione}</p>

              <p className="mt-3">{selected.descrizione}</p>
            </div>
          ) : (
            <p className="text-center mt-5">Seleziona un luogo da esplorare.</p>
          )}
        </Col>
      </Row>
    </Container>
  )
}
