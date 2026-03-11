import { useEffect, useState } from "react"
import { ListGroup } from "react-bootstrap"

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
      <h4 className="handwritten mt-4">Le mie medaglie</h4>
      <ListGroup className="mb-4">
        {medaglie.length === 0 && (
          <p className="text-muted">
            Non hai ancora medaglie… continua a esplorare!
          </p>
        )}

        {medaglie.map((m) => (
          <ListGroup.Item
            key={m.id}
            className="d-flex align-items-center gap-3"
          >
            <img
              src={m.icona}
              alt={m.nome}
              style={{ width: "40px", height: "40px", objectFit: "contain" }}
            />
            <strong>{m.nome}</strong> — {m.descrizione}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}
