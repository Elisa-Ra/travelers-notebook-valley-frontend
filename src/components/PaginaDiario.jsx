import { useState } from "react"
import { Form, Button, Container } from "react-bootstrap"
import MyAlert from "./MyAlert"

// COMPONENTE PER SCRIVERE UN NUOVO POST (PAGINA) NEL DIARIO DELL'UTENTE
export default function PaginaDiario() {
  // creazione post
  const [titolo, setTitolo] = useState("")
  const [contenuto, setContenuto] = useState("")
  const [idMonumento, setIdMonumento] = useState("")
  const [foto, setFoto] = useState(null)

  const [alertMessage, setAlertMessage] = useState("")
  const [alertVariant, setAlertVariant] = useState("success")

  const token = localStorage.getItem("token")

  const showAlert = (msg, variant = "success") => {
    setAlertMessage(msg)
    setAlertVariant(variant)
  }

  // Creazione nuovo post
  const createPost = async (e) => {
    e.preventDefault()

    const dto = {
      titolo,
      contenuto,
      idMonumento,
    }

    const res = await fetch("http://localhost:3001/post", {
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
      <h4 className="handwritten mt-4">Scrivi un nuovo post</h4>

      <Form onSubmit={createPost} className="mb-4">
        <Form.Group>
          <Form.Label>Titolo</Form.Label>
          <Form.Control
            value={titolo}
            onChange={(e) => setTitolo(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Contenuto</Form.Label>
          <Form.Control
            as="textarea"
            rows={4}
            value={contenuto}
            onChange={(e) => setContenuto(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>ID Monumento</Form.Label>
          <Form.Control
            value={idMonumento}
            onChange={(e) => setIdMonumento(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Foto (opzionale)</Form.Label>
          <Form.Control
            type="file"
            onChange={(e) => setFoto(e.target.files[0])}
          />
        </Form.Group>

        <Button type="submit" className="wax mt-3">
          Scrivi
        </Button>
      </Form>
    </>
  )
}
