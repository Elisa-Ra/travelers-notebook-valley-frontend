import { useState, useEffect } from "react"
import { Modal, Form } from "react-bootstrap"
import { API_URL } from "../api"
import Loading from "./Loading"

export default function PostModifica({ show, onHide, post, onSave }) {
  const [titolo, setTitolo] = useState("")
  const [contenuto, setContenuto] = useState("")
  const [fotoFile, setFotoFile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const token = localStorage.getItem("token")

  useEffect(() => {
    if (!post) return
    setTitolo(post.titolo || "")
    setContenuto(post.contenuto || "")
    setFotoFile(null)
  }, [post])

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setIsLoading(true)

      // aggiorna titolo e contenuto
      const resText = await fetch(`${API_URL}/posts/${post.id}`, {
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
      if (!resText.ok)
        throw new Error("Ops, c'è stato un errore nella modifica del testo.")
      // aggiorna foto (se è presente)
      let newFotoUrl = post.fotoUrl
      if (fotoFile) {
        const fd = new FormData()
        fd.append("file", fotoFile)

        const resImg = await fetch(`${API_URL}/posts/${post.id}/foto`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,
        })
        if (!resImg.ok)
          throw new Error(
            "Ops, c'è stato un errore nell'aggiornamento dell'immagine.",
          )
        const dataImg = await resImg.json()
        newFotoUrl = dataImg.fotoUrl
      }

      onSave({ titolo, contenuto, fotoUrl: newFotoUrl })
      onHide()
    } catch {
      alert("Errore durante la modifica della pagina.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      {isLoading && (
        <div className="loading-overlay">
          <Loading />
        </div>
      )}
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
