import { useEffect, useState } from "react"
import { Form, Button, ListGroup } from "react-bootstrap"

// PAGINA PER LA GESTIONE DELLE CATEGORIE (SOLO ADMIN)
export default function ManageCategories() {
  // Stati locali
  // Lista delle categorie (dal backend)
  const [categorie, setCategorie] = useState([])
  // La nuova categoria da creare
  const [newCategoria, setNewCategoria] = useState("")
  // id della categoria per la modifica
  const [editingId, setEditingId] = useState(null)
  // nuovo valore che assume la categoria durante la modifica
  const [editingValue, setEditingValue] = useState("")

  // recupero il token dal localStorage
  const token = localStorage.getItem("token")

  // FETCH DELLE CATEGORIE
  useEffect(() => {
    const fetchCategorie = async () => {
      try {
        const res = await fetch("http://localhost:3001/categorie", {
          headers: { Authorization: `Bearer ${token}` },
        })

        const data = await res.json()
        setCategorie(data)
      } catch (err) {
        console.error("Errore nel caricamento categorie", err)
      }
    }

    fetchCategorie()
  }, [token])

  // AGGIUNGO UNA NUOVA CATEGORIA
  const createCategoria = async (e) => {
    e.preventDefault()

    try {
      const res = await fetch("http://localhost:3001/categorie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoria: newCategoria }),
      })

      if (res.ok) {
        const created = await res.json()

        // aggiorno lo stato della categoria
        setCategorie((prev) => [...prev, created])
        // svuoto l'input
        setNewCategoria("")
      }
    } catch (err) {
      console.error("Errore creazione categoria", err)
    }
  }

  // ELIMINO UNA CATEGORIA
  const deleteCategoria = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/categorie/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        // rimuovo la categoria dallo stato locale
        setCategorie((prev) => prev.filter((c) => c.id !== id))
      }
    } catch (err) {
      console.error("Errore eliminazione categoria", err)
    }
  }

  // MODIFICO UNA CATEGORIA
  const updateCategoria = async (id) => {
    try {
      const res = await fetch(`http://localhost:3001/categorie/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ categoria: editingValue }),
      })

      if (res.ok) {
        const updated = await res.json()

        // modifico la categoria nello stato locale
        setCategorie((prev) => prev.map((c) => (c.id === id ? updated : c)))
        // tolgo l'id della categoria da modificare
        setEditingId(null)
      }
    } catch (err) {
      console.error("Errore modifica categoria", err)
    }
  }

  return (
    <div>
      <h2 className="handwritten mb-4">Gestione Categorie</h2>

      {/* FORM PER LA CREAZIONE DI UNA CATEGORIA*/}
      <Form onSubmit={createCategoria} className="mb-4">
        <Form.Group>
          <Form.Label htmlFor="nomeCategoria">Nuova Categoria</Form.Label>
          <Form.Control
            id="nomeCategoria"
            name="nomeCategoria"
            type="text"
            value={newCategoria}
            onChange={(e) => setNewCategoria(e.target.value)}
            placeholder="Es. Monumenti, Musei..."
            required
          />
        </Form.Group>

        <Button type="submit" className="wax mt-3">
          Aggiungi Categoria
        </Button>
      </Form>

      {/* LISTA DELLE CATEGORIE */}
      <ListGroup>
        {categorie.map((cat) => (
          <ListGroup.Item
            key={cat.id}
            className="d-flex justify-content-between align-items-center"
          >
            {editingId === cat.id ? (
              <input
                type="text"
                className="form-control"
                value={editingValue}
                onChange={(e) => setEditingValue(e.target.value)}
              />
            ) : (
              <span>{cat.categoria}</span>
            )}

            <div>
              {editingId === cat.id ? (
                <Button
                  className="btn-sm me-2 wax"
                  onClick={() => updateCategoria(cat.id)}
                >
                  Salva
                </Button>
              ) : (
                <Button
                  className="btn-sm me-2 wax"
                  onClick={() => {
                    setEditingId(cat.id)
                    setEditingValue(cat.categoria)
                  }}
                >
                  Modifica
                </Button>
              )}

              <Button
                className="btn-sm wax"
                variant="danger"
                onClick={() => deleteCategoria(cat.id)}
              >
                Elimina
              </Button>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  )
}
