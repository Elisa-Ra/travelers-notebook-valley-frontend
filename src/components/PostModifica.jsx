import { useState, useEffect } from "react"
import { Modal, Form } from "react-bootstrap"
import { API_URL } from "../api"

export default function PostModifica({ show, onHide, post, onSave }) {
  const [titolo, setTitolo] = useState("")
  const [contenuto, setContenuto] = useState("")
  const [fotoFile, setFotoFile] = useState(null)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!post) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitolo(post.titolo || "")
    setContenuto(post.contenuto || "")
    setFotoFile(null)
  }, [post])

  const handleSubmit = async (e) => {
    e.preventDefault()

    // aggiorna testo
    await fetch(`${API_URL}/posts/${post.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        titolo,
        contenuto,
        idMonumento: post.idMonumento,
      }),
    })

    // aggiorna foto
    if (fotoFile) {
      const fd = new FormData()
      fd.append("file", fotoFile)

      await fetch(`${API_URL}/posts/${post.id}/foto`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd,
      })
    }

    onSave({ titolo, contenuto })
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Riscrivi pagina del diario</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Titolo</Form.Label>
            <Form.Control
              type="text"
              value={titolo}
              onChange={(e) => setTitolo(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contenuto</Form.Label>
            <Form.Control
              as="textarea"
              rows={5}
              value={contenuto}
              onChange={(e) => setContenuto(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Carica nuova immagine</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setFotoFile(e.target.files[0])}
            />
          </Form.Group>

          <div className="d-flex">
            <button type="submit" className="wax mt-3 ms-auto">
              Salva
            </button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
