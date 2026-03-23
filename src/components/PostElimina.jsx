import { Modal, Button } from "react-bootstrap"
import { API_URL } from "../api"

export default function PostElimina({ show, onHide, post, onDelete }) {
  const token = localStorage.getItem("token")
  if (!post) return null

  const handleDelete = async () => {
    await fetch(`${API_URL}/posts/${post.id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    onDelete(post.id) // aggiorna lo stato in PostDiario
    onHide()
  }

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Elimina pagina</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <p>Sei sicuro di voler cancellare questa pagina dal tuo diario?</p>
        <p className="text-danger fw-bold">
          La pagina non potrà essere ripristinata.
        </p>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Annulla
        </Button>
        <Button variant="danger" onClick={handleDelete}>
          Elimina definitivamente
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
