import { useState, useEffect } from "react"
import { Modal } from "react-bootstrap"
import { API_URL } from "../api"

export default function ProfiloModifica({ show, onHide, user, onSave }) {
  const [editedUsername, setEditedUsername] = useState("")
  const [editedEmail, setEditedEmail] = useState("")
  const [fileAvatar, setFileAvatar] = useState(null)

  // quando viene aperto il modale, i campi vengono riempiti con i dati dell'utente
  useEffect(() => {
    if (show && user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setEditedUsername(user.username)
      setEditedEmail(user.email)
      setFileAvatar(null)
    }
  }, [show, user])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFileAvatar(file)
  }

  const handleSave = async () => {
    const token = localStorage.getItem("token")

    // modifico l'avatar se è stato caricato un file
    if (fileAvatar) {
      const formData = new FormData()
      formData.append("file", fileAvatar)

      await fetch(`${API_URL}/utenti/me/avatar`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
    }

    // modifico l'username e l'email
    const response = await fetch(`${API_URL}/utenti/me`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username: editedUsername,
        email: editedEmail,
      }),
    })

    // se tutto va bene, si salvano le modifiche e si chiude il modale
    if (response.ok) {
      const finalUser = await response.json()
      onSave(finalUser)
      onHide()
    }
  }
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Modifica il tuo profilo</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={editedUsername}
            onChange={(e) => setEditedUsername(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            value={editedEmail}
            onChange={(e) => setEditedEmail(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Avatar</label>
          <input
            type="file"
            className="form-control"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      </Modal.Body>

      <Modal.Footer>
        <button className="wax" onClick={onHide}>
          Annulla
        </button>
        <button className="wax" onClick={handleSave}>
          Salva
        </button>
      </Modal.Footer>
    </Modal>
  )
}
