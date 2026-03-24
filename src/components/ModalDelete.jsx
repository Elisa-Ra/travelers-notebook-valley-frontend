import { Modal, Button } from "react-bootstrap"

export default function ModalDelete({
  show,
  onClose,
  onConfirm,
  itemName = "l'elemento",
}) {
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Conferma l'eliminazione</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        Sei davvero sicuro di voler eliminare <strong>{itemName}</strong>?
        Questa azione non può essere annullata.
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Annulla
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Elimina
        </Button>
      </Modal.Footer>
    </Modal>
  )
}
