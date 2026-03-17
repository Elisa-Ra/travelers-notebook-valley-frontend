import { useEffect, useState } from "react"
import { ListGroup } from "react-bootstrap"
import { BsAwardFill } from "react-icons/bs"

// COMPONENTE CHE MOSTRA LE MEDAGLIE POSSEDUTE DALL'UTENTE
export default function ProfiloMedaglie() {
  const [medaglie, setMedaglie] = useState([])

  const token = localStorage.getItem("token")

  // Recupero le medaglie dell’utente
  useEffect(() => {
    const fetchMedaglie = async () => {
      const res = await fetch("http://localhost:3001/medaglie/me/medaglie", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setMedaglie(data)
      }
    }

    if (token) fetchMedaglie()
  }, [token])

  return (
    <>
      {/* SEZIONE MEDAGLIE */}
      <h4 className="handwritten mt-4 text-center d-flex justify-content-center align-items-center gap-2">
        <BsAwardFill className="oro" />
        I MIEI ADESIVI
        <BsAwardFill className="oro" />
      </h4>
      <ListGroup className="mb-4">
        {medaglie.length === 0 && (
          <p className="text-muted">
            Non hai ancora nessun adesivo... Scrivi delle nuove pagine nel tuo
            diario per provare a collezionarli tutti!
          </p>
        )}

        {medaglie.map((m) => (
          <ListGroup.Item key={m.id} className="d-flex align-items-start gap-4">
            {/* COLONNA SINISTRA ICONA */}

            <div className="medaglia-wrapper">
              <img src={m.icona} alt={m.nome} className="medaglia-icona" />
            </div>

            {/* COLONNA DESTRA */}
            <div className="flex-grow-1">
              {/* Sopra */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                {/* nome */}
                <div
                  className="fw-bold text-truncate"
                  style={{
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {m.nome}
                </div>

                {/* data */}
                {m.dataConferimento && (
                  <div
                    className="text-muted mt-1 mt-md-0"
                    style={{ fontSize: "0.85rem", whiteSpace: "nowrap" }}
                  >
                    {new Date(m.dataConferimento).toLocaleDateString()}
                  </div>
                )}
              </div>

              {/* sotto descrizione */}
              <div className="mt-1">{m.descrizione}</div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}
