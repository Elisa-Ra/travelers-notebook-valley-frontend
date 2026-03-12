import { useState, useEffect } from "react"
import { Form, Button, Container } from "react-bootstrap"
import MyAlert from "./MyAlert"
import { BsVectorPen } from "react-icons/bs"

// COMPONENTE PER SCRIVERE UN NUOVO POST (PAGINA) NEL DIARIO DELL'UTENTE
export default function PaginaDiario({ onPostCreated }) {
  // creazione post
  const [titolo, setTitolo] = useState("")
  const [contenuto, setContenuto] = useState("")
  const [idMonumento, setIdMonumento] = useState("")
  const [foto, setFoto] = useState(null)
  const [monumenti, setMonumenti] = useState([])

  const [alertMessage, setAlertMessage] = useState("")
  const [alertVariant, setAlertVariant] = useState("success")

  const token = localStorage.getItem("token")

  const showAlert = (msg, variant = "success") => {
    setAlertMessage(msg)
    setAlertVariant(variant)
  }
  // recupero la lista di monumenti
  useEffect(() => {
    const fetchMonumenti = async () => {
      const res = await fetch("http://localhost:3001/monumento", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setMonumenti(data)
      }
    }

    fetchMonumenti()
  }, [token])

  // Creazione di nuovo post (pagina)
  const createPost = async (e) => {
    e.preventDefault()

    const dto = {
      titolo,
      contenuto,
      idMonumento,
    }

    const res = await fetch("http://localhost:3001/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })

    if (!res.ok) {
      showAlert("Errore nella creazione del post", "danger")
      return
    }

    const created = await res.json()

    // Se c’è una foto, la carico
    if (foto) {
      const formData = new FormData()
      formData.append("file", foto)

      await fetch(`http://localhost:3001/foto/${created.id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
    }

    showAlert("Post creato con successo!")
    onPostCreated()

    // resetto i campi
    setTitolo("")
    setContenuto("")
    setIdMonumento("")
    setFoto(null)
  }

  return (
    <>
      <MyAlert
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertMessage("")}
      />

      {/* FORM NUOVO POST */}
      <h4 className="handwritten my-4">Scrivi una nuova pagina</h4>

      <Form onSubmit={createPost}>
        <Form.Group className="my-4">
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="my-4">
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={contenuto}
            onChange={(e) => setContenuto(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="my-4">
          <Form.Label>Monumento</Form.Label>
          <Form.Select
            value={idMonumento}
            onChange={(e) => setIdMonumento(e.target.value)}
            required
          >
            <option value="">Seleziona un monumento...</option>

            {monumenti.map((m) => (
              <option key={m.id} value={m.id}>
                {m.nome}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="my-4">
          <Form.Label>Foto (opzionale)</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFoto(e.target.files[0])}
          />
        </Form.Group>

        <div className="d-flex justify-content-end pe-2">
          <Button type="submit" className="wax mt-3">
            Scrivi <BsVectorPen />
          </Button>
        </div>
      </Form>
    </>
  )
}
