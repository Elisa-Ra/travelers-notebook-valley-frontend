import { useState, useEffect } from "react"
import { Modal, Button, Form } from "react-bootstrap"

export default function ModificaPost({ show, onHide, post, onSave }) {
  const [titolo, setTitolo] = useState("")
  const [contenuto, setContenuto] = useState("")
  const [fotoFile, setFotoFile] = useState(null)

  useEffect(() => {
    if (!post) return
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTitolo(post.titolo || "")
    setContenuto(post.contenuto || "")
    setFotoFile(null)
  }, [post])

  const handleSubmit = async (e) => {
    e.preventDefault()

    await onSave({
      titolo,
      contenuto,
      fotoFile,
    })

    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica pagina del diario</Modal.Title>
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

          <Button variant="warning" type="submit" className="w-100">
            Salva modifiche
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  )
}
