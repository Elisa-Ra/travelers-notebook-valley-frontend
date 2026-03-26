import { useEffect, useState } from "react"
import { Container, Card, Button } from "react-bootstrap"
import ModificaPost from "./PostModifica"
import EliminaPost from "./PostElimina"
import HTMLFlipBook from "react-pageflip"
import MyAlert from "./MyAlert"
import DiarioPdf from "./DiarioPDF"
import { API_URL } from "../api"

export default function PostDiario({ refresh }) {
  const [posts, setPosts] = useState([])
  const token = localStorage.getItem("token")

  // per modificare, eliminare il post selezionato
  const [showEdit, setShowEdit] = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  // numero totale di pagine
  const totalPages = posts.length

  // alert
  const [alertMessage, setAlertMessage] = useState("")
  const [alertVariant, setAlertVariant] = useState("success")

  // creo una costante per la width della pagina così su mobile faccio apparire una pagina di diario e su desktop due
  const [pageWidth, setPageWidth] = useState(550)
  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 768) {
        setPageWidth(350) // mobile una pagina
      } else if (window.innerWidth < 992) {
        setPageWidth(450)
      } else {
        setPageWidth(550) // desktop due pagine
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // fetch post
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`${API_URL}/posts/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    }

    if (token) fetchPosts()
  }, [token, refresh])

  // elimina post
  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id))
    setAlertVariant("danger")
    setAlertMessage("La pagina è stata eliminata con successo!")
  }

  return (
    <Container className="py-1 mb-4 px-0">
      <MyAlert
        message={alertMessage}
        variant={alertVariant}
        onClose={() => setAlertMessage("")}
      />

      {posts.length === 0 && (
        <p className="text-muted text-center">
          Le pagine sono ancora vuote... Scrivi la prima pagina del tuo diario!
        </p>
      )}

      {posts.length > 0 && (
        <>
          <DiarioPdf posts={posts} />
          <div id="diary-wrapper" className="">
            <HTMLFlipBook
              key={pageWidth + "-" + posts.length}
              width={pageWidth}
              mobileScrollSupport={true}
              height={700}
              minWidth={300}
              minHeight={400}
              maxHeight={1200}
              className="diary-book"
              style={{ margin: "0 auto" }}
            >
              {posts.map((p, index) => {
                // numero pagina corrente
                const pageNumber = index + 1

                return (
                  <div
                    key={p.id}
                    className="page-background diary-page-size px-3 py-3 diary-page d-flex flex-column"
                  >
                    <h2 className="handwritten mb-3 fs-2">{p.titolo}</h2>

                    <Card className="shadow-sm my-1 card-diario">
                      {p.fotoUrl ? (
                        <Card.Img
                          src={p.fotoUrl}
                          alt={p.titolo}
                          className="img-fluid"
                        />
                      ) : (
                        <div className="placeholder-foto d-flex flex-column justify-content-center align-items-center">
                          <p className="fs-4 mb-1">
                            Non hai ancora caricato un'immagine
                          </p>
                          <p className="text-muted">
                            Aggiungi un ricordo visivo
                          </p>
                        </div>
                      )}
                    </Card>

                    <p className="diary-text mt-2">{p.contenuto}</p>

                    {/* FOOTER PAGINA */}
                    <div className="diary-footer mt-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <small className="text-muted">
                          Pagina scritta il giorno{" "}
                          {new Date(p.dataCreazione).toLocaleDateString()}
                        </small>

                        <small className="text-muted">
                          Pagina {pageNumber} di {totalPages}
                        </small>
                      </div>

                      <div className="text-start mt-2">
                        <Button
                          variant="warning"
                          onClick={() => {
                            setSelectedPost(p)
                            setShowEdit(true)
                          }}
                          className="me-3"
                        >
                          Riscrivi
                        </Button>
                        <Button
                          variant="danger"
                          onClick={() => {
                            setSelectedPost(p)
                            setShowDelete(true)
                          }}
                        >
                          Cancella
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </HTMLFlipBook>
          </div>
        </>
      )}

      {/* Modale modifica */}
      {selectedPost && (
        <ModificaPost
          show={showEdit}
          onHide={() => setShowEdit(false)}
          post={selectedPost}
          onSave={({ titolo, contenuto, fotoUrl }) => {
            setPosts((prev) =>
              prev.map((p) =>
                p.id === selectedPost.id
                  ? { ...p, titolo, contenuto, fotoUrl }
                  : p,
              ),
            )
            setAlertVariant("success")
            setAlertMessage("Pagina modificata con successo!")
          }}
        />
      )}

      {/* Modale eliminazione */}
      {selectedPost && (
        <EliminaPost
          show={showDelete}
          onHide={() => setShowDelete(false)}
          post={selectedPost}
          onDelete={handleDelete}
        />
      )}
    </Container>
  )
}
