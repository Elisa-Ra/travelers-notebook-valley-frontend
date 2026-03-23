import { useState, useEffect } from "react"
import { Form, Button, Collapse } from "react-bootstrap"
import MyAlert from "./MyAlert"
import { BsVectorPen } from "react-icons/bs"
import { API_URL } from "../api"

// COMPONENTE PER SCRIVERE UN NUOVO POST (PAGINA) NEL DIARIO DELL'UTENTE
export default function PostAggiungi({ onPostCreated }) {
  // creazione post
  const [titolo, setTitolo] = useState("")
  const [contenuto, setContenuto] = useState("")
  const [idMonumento, setIdMonumento] = useState("")
  const [foto, setFoto] = useState(null)
  const [monumenti, setMonumenti] = useState([])

  const [alertMessage, setAlertMessage] = useState("")
  const [alertVariant, setAlertVariant] = useState("success")

  const [open, setOpen] = useState(false)

  const token = localStorage.getItem("token")

  const showAlert = (msg, variant = "success") => {
    setAlertMessage(msg)
    setAlertVariant(variant)
  }

  // recupero la lista di monumenti
  useEffect(() => {
    const fetchMonumenti = async () => {
      const res = await fetch(`${API_URL}/monumento`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setMonumenti(data)
      }
    }

    fetchMonumenti()
  }, [token])

  // Creazione di nuovo post (pagina)
  const createPost = async (e) => {
    e.preventDefault()

    const dto = {
      titolo,
      contenuto,
      idMonumento,
    }

    const res = await fetch(`${API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(dto),
    })

    if (!res.ok) {
      showAlert(
        "Errore nella scrittura della pagina, riprova più tardi.",
        "danger",
      )
      return
    }

    const created = await res.json()

    // Se c'è una foto, la carico
    if (foto) {
      const formData = new FormData()
      formData.append("file", foto)

      await fetch(`${API_URL}/posts/${created.id}/foto`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      })
    }

    showAlert("La pagina è stata aggiunta al tuo diario!")
    onPostCreated()

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

      {/* Bottone per aprire/chiudere il form */}
      <div className="d-flex justify-content-center mb-3 ">
        <Button
          variant="warning"
          onClick={() => setOpen(!open)}
          aria-controls="nuova-pagina-collapse"
          aria-expanded={open}
          className="fs-5"
        >
          {open ? "Chiudi " : "Scrivi "}
          <BsVectorPen />
        </Button>
      </div>

      <Collapse in={open}>
        <div id="nuova-pagina-collapse">
          {/* FORM NUOVO POST */}
          <h3 className="handwritten my-4">Scrivi una nuova pagina</h3>

          <Form
            onSubmit={createPost}
            className="page-background py-3 px-5 fs-5"
          >
            <Form.Group className="my-4">
              <Form.Label htmlFor="titolo-pagina">
                <strong>Titolo</strong>
              </Form.Label>
              <Form.Control
                id="titolo-pagina"
                value={titolo}
                onChange={(e) => setTitolo(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="my-4">
              <Form.Label htmlFor="contenuto-pagina">
                <strong>Contenuto</strong>
              </Form.Label>
              <Form.Control
                id="contenuto-pagina"
                as="textarea"
                rows={4}
                value={contenuto}
                onChange={(e) => setContenuto(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="my-4">
              <Form.Label htmlFor="monumento-pagina">
                <strong>Monumento</strong>
              </Form.Label>
              <Form.Select
                id="monumento-pagina"
                value={idMonumento}
                onChange={(e) => setIdMonumento(e.target.value)}
                required
              >
                <option value="">Seleziona un monumento...</option>

                {monumenti.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.nome}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="my-4">
              <Form.Label htmlFor="foto-pagina">
                <strong>Foto &#40;opzionale&#41;</strong>
              </Form.Label>
              <Form.Control
                id="foto-pagina"
                type="file"
                onChange={(e) => setFoto(e.target.files[0])}
              />
            </Form.Group>

            <div className="d-flex justify-content-end pe-2">
              <button type="submit" className="wax mt-3">
                Scrivi <BsVectorPen className="ms-1" />
              </button>
            </div>
          </Form>
        </div>
      </Collapse>
    </>
  )
}
