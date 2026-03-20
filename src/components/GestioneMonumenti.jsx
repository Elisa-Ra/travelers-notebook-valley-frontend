import { useEffect, useState } from "react"
import { Form, Button, ListGroup, Modal, Container } from "react-bootstrap"
import MyAlert from "./MyAlert"
import PostChart from "./PostChart"

// PAGINA PER LA GESTIONE DEI MONUMENTI (SOLO ADMIN)
export default function GestioneMonumenti() {
  // Liste dei monumenti e delle categorie (dal backend)
  const [monumenti, setMonumenti] = useState([])
  const [categorie, setCategorie] = useState([])

  // stati per la creazione
  const [nome, setNome] = useState("")
  const [descrizione, setDescrizione] = useState("")
  const [posizione, setPosizione] = useState("")
  const [nomeCategoria, setNomeCategoria] = useState("")
  const [foto, setFoto] = useState(null)

  // Stati per la modifica
  const [showEdit, setShowEdit] = useState(false)
  const [editData, setEditData] = useState({
    id: null,
    nome: "",
    descrizione: "",
    posizione: "",
    nomeCategoria: "",
  })
  const [newFoto, setNewFoto] = useState(null)

  // alert
  const [alertMessage, setAlertMessage] = useState("")
  const [alertVariant, setAlertVariant] = useState("success")

  const showAlert = (msg, variant = "success") => {
    setAlertMessage(msg)
    setAlertVariant(variant)
  }

  // recupero il token dal localStorage
  const token = localStorage.getItem("token")

  // GET DEI MONUMENTI
  useEffect(() => {
    const fetchMonumenti = async () => {
      try {
        const res = await fetch("http://localhost:3001/monumento")
        if (!res.ok) {
          console.error("Errore nel caricamento monumenti:", res.status)
          return
        }
        const data = await res.json()
        setMonumenti(data)
      } catch (err) {
        console.error("Si è verificato un errore:", err)
      }
    }
    // GET delle categorie
    const fetchCategorie = async () => {
      try {
        const res = await fetch("http://localhost:3001/categorie", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          console.error("Errore nel caricamento categorie:", res.status)
          return
        }

        const data = await res.json()
        setCategorie(data)
      } catch (err) {
        console.error("Si è verificato un errore:", err)
      }
    }

    fetchMonumenti()
    fetchCategorie()
  }, [token])

  // AGGIUNGO UN NUOVO MONUMENTO
  const createMonumento = async (e) => {
    e.preventDefault()

    const dto = {
      nome,
      descrizione,
      posizione,
      nomeCategoria,
    }

    // Post del monumento
    const res = await fetch("http://localhost:3001/monumento", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })

    if (!res.ok) {
      showAlert("Ops, si è verificato un errore.", "danger")
      return
    }

    const created = await res.json()

    // Carico la foto se è presente
    if (foto) {
      const formData = new FormData()
      formData.append("file", foto)

      const uploadRes = await fetch(
        `http://localhost:3001/monumento/${created.id}/foto`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      )
      // se il caricamento va a buon fine modifico la foto con quella nuova, sennò lascio quella vecchia
      if (uploadRes.ok) {
        const updated = await uploadRes.json()
        setMonumenti((prev) => [...prev, updated])
      } else {
        setMonumenti((prev) => [...prev, created])
      }
    } else {
      setMonumenti((prev) => [...prev, created])
    }

    showAlert("Monumento aggiunto con successo!")

    // reset
    setNome("")
    setDescrizione("")
    setPosizione("")
    setNomeCategoria("")
    setFoto(null)
  }

  // ELIMINO UN MONUMENTO
  const deleteMonumento = async (id) => {
    const res = await fetch(`http://localhost:3001/monumento/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })

    if (res.ok) {
      setMonumenti((prev) => prev.filter((m) => m.id !== id))
      showAlert("Il monumento è stato eliminato con successo!", "danger")
    }
  }

  const openEdit = (mon) => {
    setEditData({
      id: mon.id,
      nome: mon.nome,
      descrizione: mon.descrizione,
      posizione: mon.posizione,
      nomeCategoria: (mon.nomeCategoria || "").trim(),
    })
    setShowEdit(true)
  }

  // MODIFICO UN MONUMENTO
  const updateMonumento = async () => {
    const dto = {
      nome: editData.nome,
      descrizione: editData.descrizione,
      posizione: editData.posizione,
      nomeCategoria: editData.nomeCategoria.trim(),
    }

    // modifico
    const res = await fetch(`http://localhost:3001/monumento/${editData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })

    if (!res.ok) {
      showAlert("Ops, si è verificato un errore durante la modifica.", "danger")
      return
    }

    const updated = await res.json()

    // aggiorno la lista dei monumenti
    setMonumenti((prev) => prev.map((m) => (m.id === updated.id ? updated : m)))

    // Modifico la foto (se è presente)
    if (newFoto) {
      const formData = new FormData()
      formData.append("file", newFoto)

      const uploadRes = await fetch(
        `http://localhost:3001/monumento/${editData.id}/foto`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      )

      if (uploadRes.ok) {
        const updatedWithPhoto = await uploadRes.json()

        // aggiorno la lista dei monumenti con l'elemento modificato
        setMonumenti((prev) =>
          prev.map((m) =>
            m.id === updatedWithPhoto.id ? updatedWithPhoto : m,
          ),
        )

        showAlert("Monumento e foto aggiornati con successo!")
      } else {
        showAlert(
          "Il monumento è stato aggiornato con successo. Errore nell'aggiornare la foto.",
          "warning",
        )
      }
    } else {
      showAlert("Il monumento è stato aggiornato con successo!")
    }

    setNewFoto(null)
    setShowEdit(false)
  }

  return (
    <div className="mx-auto page-background p-4">
      <h2 className="handwritten mb-4 text-center mt-2">Gestione Monumenti</h2>

      <Container className="my-5 bg-white pb-2" style={{ minHeight: 500 }}>
        <PostChart />
      </Container>
      <h3 className="text-center mt-5 handwritten">Aggiungi un monumento</h3>
      {/* messaggio di alert */}
      <MyAlert
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertMessage("")}
      />

      {/* FORM PER LA CREAZIONE DI UN MONUMENTO*/}
      <Form onSubmit={createMonumento} className="mb-4 mx-auto w-75">
        <Form.Group className="mb-3">
          <Form.Label htmlFor="nome">Nome</Form.Label>
          <Form.Control
            id="nome"
            name="nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="descrizione">Descrizione</Form.Label>
          <Form.Control
            id="descrizione"
            name="descrizione"
            as="textarea"
            rows={3}
            value={descrizione}
            onChange={(e) => setDescrizione(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="posizione">Posizione</Form.Label>
          <Form.Control
            id="posizione"
            name="posizione"
            value={posizione}
            onChange={(e) => setPosizione(e.target.value)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="categoria">Categoria</Form.Label>
          <Form.Select
            id="categoria"
            name="categoria"
            value={nomeCategoria}
            onChange={(e) => setNomeCategoria(e.target.value)}
            required
          >
            <option value="">Seleziona categoria</option>
            {categorie.map((cat) => (
              <option key={cat.id} value={cat.categoria}>
                {cat.categoria}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="foto">Foto</Form.Label>
          <Form.Control
            id="foto"
            name="foto"
            type="file"
            onChange={(e) => setFoto(e.target.files[0])}
          />
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button type="submit" variant="success" className="mt-3 ">
            Aggiungi
          </Button>
        </div>
      </Form>

      {/* LISTA DEI MONUMENTI */}
      <ListGroup>
        {monumenti.map((mon) => (
          <ListGroup.Item
            key={mon.id}
            className="d-flex justify-content-between align-items-center py-3"
          >
            {/* COLONNA SINISTRA */}
            <div className="d-flex align-items-center gap-3">
              <img
                src={mon.foto}
                alt={mon.nome}
                style={{
                  width: "50px",
                  height: "50px",
                  objectFit: "contain",
                  flexShrink: 0,
                }}
              />
              <div className="d-flex flex-column">
                <strong className="fs-5">{mon.nome}</strong>
                <span className="text-muted">{mon.descrizione}</span>
                <span>{mon.nomeCategoria}</span>
              </div>
            </div>

            {/* COLONNA DESTRA */}
            <div className="d-flex flex-column align-items-end gap-2">
              <Button
                className="btn-sm"
                variant="warning"
                onClick={() => openEdit(mon)}
              >
                Modifica
              </Button>

              <Button
                className="btn-sm"
                variant="danger"
                onClick={() => deleteMonumento(mon.id)}
              >
                Elimina
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* MODALE MODIFICA MONUMENTO*/}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Modifica Monumento</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label htmlFor="modNome">Nome</Form.Label>
              <Form.Control
                id="modNome"
                name="modNome"
                value={editData.nome}
                onChange={(e) =>
                  setEditData({ ...editData, nome: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="modDescrizione">Descrizione</Form.Label>
              <Form.Control
                id="modDescrizione"
                name="modDescrizione"
                as="textarea"
                rows={3}
                value={editData.descrizione}
                onChange={(e) =>
                  setEditData({ ...editData, descrizione: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="modPosizione">Posizione</Form.Label>
              <Form.Control
                id="modPosizione"
                name="modPosizione"
                value={editData.posizione}
                onChange={(e) =>
                  setEditData({ ...editData, posizione: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="modCategoria">Categoria</Form.Label>
              <Form.Select
                id="modCategoria"
                name="modCategoria"
                value={editData.nomeCategoria}
                onChange={(e) =>
                  setEditData({ ...editData, nomeCategoria: e.target.value })
                }
              >
                {categorie.map((cat) => (
                  <option key={cat.id} value={cat.categoria.trim()}>
                    {cat.categoria}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="modFoto">Nuova foto</Form.Label>
              <Form.Control
                id="modFoto"
                name="modFoto"
                type="file"
                onChange={(e) => setNewFoto(e.target.files[0])}
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="success" onClick={updateMonumento}>
            Salva
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  )
}
