import { useEffect, useState } from "react"
import { Form, Button, ListGroup, Modal } from "react-bootstrap"
import MyAlert from "./MyAlert"
import MyLoading from "./Loading"
import { API_URL } from "../api"
import ModalDelete from "./ModalDelete"

export default function ManageMedaglie() {
  const [medaglie, setMedaglie] = useState([])
  const [monumenti, setMonumenti] = useState([])

  // stati per la creazione
  const [nome, setNome] = useState("")
  const [descrizione, setDescrizione] = useState("")
  const [icona, setIcona] = useState(null)
  const [idMonumento, setIdMonumento] = useState("")

  // stati per la modifica
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState({
    id: null,
    nome: "",
    descrizione: "",
    icona: "",
    idMonumento: "",
  })

  // alert
  const [alertMessage, setAlertMessage] = useState("")
  const [alertVariant, setAlertVariant] = useState("success")
  // loading
  const [loading, setLoading] = useState(false)
  // per il modale di eliminazione
  const [showDelete, setShowDelete] = useState(false)
  const [deleteId, setDeleteId] = useState(null)

  const token = localStorage.getItem("token")

  const showAlert = (msg, variant = "success") => {
    setAlertMessage(msg)
    setAlertVariant(variant)
  }

  // GET medaglie
  useEffect(() => {
    const fetchMedaglie = async () => {
      const res = await fetch(`${API_URL}/medaglie`, {
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
  }, [token])

  // GET monumenti
  useEffect(() => {
    const fetchMonumenti = async () => {
      const res = await fetch(`${API_URL}/monumento`)
      if (res.ok) {
        const data = await res.json()
        setMonumenti(data)
      }
    }
    fetchMonumenti()
  }, [])

  // CREAZIONE medaglia
  const createMedaglia = async (e) => {
    e.preventDefault()
    setLoading(true) // ← attivo il loader

    try {
      const dto = { nome, descrizione, icona: "", idMonumento }

      const res = await fetch(`${API_URL}/medaglie`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      })

      if (!res.ok) {
        showAlert("Errore durante la creazione", "danger")
        setLoading(false)
        return
      }

      const created = await res.json()

      // Se viene caricata un'icona
      if (icona) {
        const formData = new FormData()
        formData.append("file", icona)

        const uploadRes = await fetch(
          `${API_URL}/medaglie/${created.id}/icona`,
          {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
            body: formData,
          },
        )

        if (uploadRes.ok) {
          const updated = await uploadRes.json()
          setMedaglie((prev) => [...prev, updated])
          showAlert("La medaglia è stata creata con successo!")
        }
      } else {
        setMedaglie((prev) => [...prev, created])
        showAlert("La medaglia è stata creata!")
      }

      // reset campi
      setNome("")
      setDescrizione("")
      setIcona(null)
      e.target.reset()
    } catch {
      showAlert("Errore durante la creazione", "danger")
    }

    setLoading(false) // ← disattivo il loader
  }

  // funzione per aprire il modale di modifica
  const openEdit = (m) => {
    setEditData({
      id: m.id,
      nome: m.nome,
      descrizione: m.descrizione,
      icona: m.icona,
      idMonumento: m.monumento?.id || "",
    })
    setShowEdit(true)
  }

  // MODIFICA medaglia
  const updateMedaglia = async () => {
    setLoading(true)
    try {
      const dto = {
        nome: editData.nome,
        descrizione: editData.descrizione,
        icona: editData.icona,
        idMonumento: editData.idMonumento,
      }

      // Aggiorno i dati testuali
      const res = await fetch(`${API_URL}/medaglie/${editData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(dto),
      })

      if (!res.ok) {
        showAlert("Errore durante l'aggiornamento", "danger")
        setLoading(false)
        return
      }

      const updated = await res.json()
      setMedaglie((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m)),
      )

      // Se il nuovo file è stato caricato, modifico l'icona
      if (editData.newIcon) {
        const formData = new FormData()
        formData.append("file", editData.newIcon)

        const uploadRes = await fetch(
          `${API_URL}/medaglie/${editData.id}/icona`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          },
        )

        if (!uploadRes.ok) {
          showAlert("Errore durante il caricamento dell'icona", "danger")
          setLoading(false)
          return
        }

        const updatedIcon = await uploadRes.json()
        setMedaglie((prev) =>
          prev.map((m) => (m.id === updatedIcon.id ? updatedIcon : m)),
        )
      }

      showAlert("La medaglia è stata aggiornata con successo!")
      setShowEdit(false)
    } catch {
      showAlert("Errore durante l'aggiornamento", "danger")
    }

    setLoading(false)
  }

  // ELIMINA medaglia
  // modale di eliminazione medaglia
  const askDelete = (id) => {
    setDeleteId(id)
    setShowDelete(true)
  }

  const confirmDelete = async () => {
    await deleteMedaglia(deleteId)
    setShowDelete(false)
    setDeleteId(null)
  }
  // eliminazione medaglia
  const deleteMedaglia = async (id) => {
    const res = await fetch(`${API_URL}/medaglie/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      setMedaglie((prev) => prev.filter((m) => m.id !== id))
      showAlert("La medaglia è stata eliminata!", "danger")
    }
  }

  return (
    <div className="page-background p-4">
      <MyAlert
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertMessage("")}
      />
      {loading && <MyLoading />}
      <h2 className="handwritten mb-4 text-center mt-2">Gestione Medaglie</h2>

      {/* FORM CREAZIONE */}
      <Form onSubmit={createMedaglia} className="mb-4 w-75 mx-auto">
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
          <Form.Label htmlFor="monumentoAssociato">
            Monumento associato
          </Form.Label>
          <Form.Select
            id="monumentoAssociato"
            value={idMonumento}
            onChange={(e) => setIdMonumento(e.target.value)}
          >
            <option value="">Nessuno</option>
            {monumenti.map((mon) => (
              <option key={mon.id} value={mon.id}>
                {mon.nome}
              </option>
            ))}
          </Form.Select>
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

        <div className="d-flex justify-content-end">
          <Button type="submit" variant="success" className="mt-3 ">
            Aggiungi
          </Button>
        </div>
      </Form>

      {/* LISTA DELLE MEDAGLIE (adesivi) */}
      <ListGroup>
        {medaglie.map((m) => (
          <ListGroup.Item
            key={m.id}
            className="d-flex justify-content-between align-items-start py-3"
          >
            {/* COLONNA SINISTRA */}
            <div className="d-flex align-items-start gap-3">
              <img
                src={m.icona || "/placeholder.svg"}
                alt={m.nome}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />

              <div className="d-flex flex-column">
                <strong className="fs-5">{m.nome}</strong>
                <span className="text-muted">{m.descrizione}</span>
              </div>
            </div>

            {/* COLONNA DESTRA */}
            <div className="d-flex flex-column align-items-end gap-2">
              <Button
                className="btn-sm"
                variant="warning"
                onClick={() => openEdit(m)}
              >
                Modifica
              </Button>

              <Button
                className="btn-sm"
                variant="danger"
                onClick={() => askDelete(m.id)}
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
            {loading && (
              <div className="d-flex justify-content-center mb-3">
                <MyLoading />
              </div>
            )}
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
              <Form.Label htmlFor="monumentoAssociatoMod">
                Monumento associato
              </Form.Label>
              <Form.Select
                id="monumentoAssociatoMod"
                value={editData.idMonumento}
                onChange={(e) =>
                  setEditData({ ...editData, idMonumento: e.target.value })
                }
              >
                <option value="">Nessuno</option>
                {monumenti.map((mon) => (
                  <option key={mon.id} value={mon.id}>
                    {mon.nome}
                  </option>
                ))}
              </Form.Select>
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
          <Button variant="success" onClick={updateMedaglia}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalDelete
        show={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={confirmDelete}
        itemName="questa medaglia"
      />
    </div>
  )
}
