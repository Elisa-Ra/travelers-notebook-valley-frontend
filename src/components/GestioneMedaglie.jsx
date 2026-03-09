import { useEffect, useState } from "react"
import { Form, Button, ListGroup, Modal } from "react-bootstrap"
import MyAlert from "./MyAlert"

export default function ManageMedaglie() {
  const [medaglie, setMedaglie] = useState([])

  // stati per la creazione
  const [nome, setNome] = useState("")
  const [descrizione, setDescrizione] = useState("")
  const [icona, setIcona] = useState(null)

  // stati per la modifica
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState({
    id: null,
    nome: "",
    descrizione: "",
    icona: "",
  })

  // alert
  const [alertMessage, setAlertMessage] = useState("")
  const [alertVariant, setAlertVariant] = useState("success")

  const token = localStorage.getItem("token")

  const showAlert = (msg, variant = "success") => {
    setAlertMessage(msg)
    setAlertVariant(variant)
  }

  // GET medaglie
  useEffect(() => {
    const fetchMedaglie = async () => {
      const res = await fetch("http://localhost:3001/medaglie", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setMedaglie(data)
      }
    }

    fetchMedaglie()
  }, [])

  // CREAZIONE medaglia
  const createMedaglia = async (e) => {
    e.preventDefault()

    // creo la medaglia senza icona inizialmente
    const dto = { nome, descrizione, icona: "" }

    const res = await fetch("http://localhost:3001/medaglie", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })

    if (!res.ok) return

    const created = await res.json()

    // Se viene caricato un file, aggiungo l'icona
    if (icona) {
      const formData = new FormData()
      formData.append("file", icona)

      const uploadRes = await fetch(
        `http://localhost:3001/medaglie/${created.id}/icona`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )

      if (uploadRes.ok) {
        const updated = await uploadRes.json()
        // aggiorno la lista delle medaglie con la nuova icona
        setMedaglie((prev) => [...prev, updated])
        showAlert("La medaglia è stata creata con successo!")
      }
    } else {
      // se non viene caricato un file, salvo la medaglia base (senza icona)
      setMedaglie((prev) => [...prev, created])
      showAlert("La medaglia è stata creata!")
    }

    // resetto i campi
    setNome("")
    setDescrizione("")
    setIcona(null)
    e.target.reset()
  }

  // funzione per aprire il modale di modifica
  const openEdit = (m) => {
    setEditData({
      id: m.id,
      nome: m.nome,
      descrizione: m.descrizione,
      icona: m.icona,
    })
    setShowEdit(true)
  }

  // MODIFICA medaglia
  const updateMedaglia = async () => {
    const dto = {
      nome: editData.nome,
      descrizione: editData.descrizione,
      icona: editData.icona,
    }

    // Aggiorno i dati testuali
    const res = await fetch(`http://localhost:3001/medaglie/${editData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })

    if (res.ok) {
      const updated = await res.json()
      setMedaglie((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m)),
      )
      showAlert("La medaglia è stata aggiornata!")
    }

    // Se il nuovo file è stato caricato, modifico l'icona
    if (editData.newIcon) {
      const formData = new FormData()
      formData.append("file", editData.newIcon)

      const uploadRes = await fetch(
        `http://localhost:3001/medaglie/${editData.id}/icona`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      )

      if (uploadRes.ok) {
        const updatedIcon = await uploadRes.json()
        // aggiorno la lista
        setMedaglie((prev) =>
          prev.map((m) => (m.id === updatedIcon.id ? updatedIcon : m)),
        )
        showAlert("La medaglia è stata aggiornata con successo!")
      }
    }

    setShowEdit(false)
  }

  // ELIMINA medaglia
  const deleteMedaglia = async (id) => {
    const res = await fetch(`http://localhost:3001/medaglie/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      setMedaglie((prev) => prev.filter((m) => m.id !== id))
      showAlert("La medaglia è stata eliminata!", "danger")
    }
  }

  return (
    <div>
      <MyAlert
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertMessage("")}
      />

      <h2 className="handwritten mb-4 text-center mt-2">Gestione Medaglie</h2>

      {/* FORM CREAZIONE */}
      <Form onSubmit={createMedaglia} className="mb-4 w-50 mx-auto">
        <Form.Group>
          <Form.Label htmlFor="nomeMedaglia">Nome</Form.Label>
          <Form.Control
            id="nomeMedaglia"
            name="nomeMedaglia"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="descrizioneMedaglia">Descrizione</Form.Label>
          <Form.Control
            id="descrizioneMedaglia"
            name="descrizioneMedaglia"
            as="textarea"
            rows={3}
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="iconaMedaglia">Icona</Form.Label>
          <Form.Control
            id="iconaMedaglia"
            name="iconaMedaglia"
            type="file"
            onChange={(e) => setIcona(e.target.files[0])}
          />
        </Form.Group>

        <Button type="submit" className="wax mt-3">
          Aggiungi Medaglia
        </Button>
      </Form>

      {/* LISTA DELLE MEDAGLIE */}
      <ListGroup>
        {medaglie.map((m) => (
          <ListGroup.Item
            key={m.id}
            className="d-flex justify-content-between align-items-center"
          >
            <span className="d-flex align-items-center gap-2">
              <img
                src={m.icona}
                alt={m.nome}
                style={{ width: "40px", height: "40px", objectFit: "contain" }}
              />
              <strong>{m.nome}</strong> — {m.descrizione}
            </span>

            <div>
              <Button className="btn-sm me-2 wax" onClick={() => openEdit(m)}>
                Modifica
              </Button>

              <Button
                className="btn-sm wax"
                variant="danger"
                onClick={() => deleteMedaglia(m.id)}
              >
                Elimina
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* MODALE DI MODIFICA */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Medaglia</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label htmlFor="nomeMedagliaMod">Nome</Form.Label>
              <Form.Control
                id="nomeMedagliaMod"
                name="nomeMedagliaMod"
                value={editData.nome}
                onChange={(e) =>
                  setEditData({ ...editData, nome: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="descrizioneMedagliaMod">
                Descrizione
              </Form.Label>
              <Form.Control
                id="descrizioneMedagliaMod"
                name="descrizioneMedagliaMod"
                as="textarea"
                rows={3}
                value={editData.descrizione}
                onChange={(e) =>
                  setEditData({ ...editData, descrizione: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="iconaMedagliaMod">Nuova icona</Form.Label>
              <Form.Control
                id="iconaMedagliaMod"
                name="iconaMedagliaMod"
                type="file"
                onChange={(e) =>
                  setEditData({ ...editData, newIcon: e.target.files[0] })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button className="wax" onClick={updateMedaglia}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
