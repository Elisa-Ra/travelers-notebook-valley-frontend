import { useEffect, useState } from "react"
import { Container, Card, Button } from "react-bootstrap"
import ModificaPost from "./ModificaPost"
import HTMLFlipBook from "react-pageflip"

export default function PostDiario({ refresh }) {
  const [posts, setPosts] = useState([])
  const token = localStorage.getItem("token")

  const [showEdit, setShowEdit] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  // pagina corrente del flipbook
  const postsPerPage = 1
  const totalPages = Math.ceil(posts.length / postsPerPage)

  // creo una costante per la width della pagina così su mobile faccio apparire una pagina di diario e su desktop due
  const [pageWidth, setPageWidth] = useState(550)
  useEffect(() => {
    const updateWidth = () => {
      if (window.innerWidth < 768) {
        setPageWidth(350) // mobile → una pagina
      } else {
        setPageWidth(550) // desktop → due pagine
      }
    }

    updateWidth()
    window.addEventListener("resize", updateWidth)
    return () => window.removeEventListener("resize", updateWidth)
  }, [])

  // fetch post
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("http://localhost:3001/posts/me", {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (res.ok) {
        const data = await res.json()
        setPosts(data)
      }
    }

    if (token) fetchPosts()
  }, [token, refresh])

  return (
    <Container fluid className="py-1 mb-4">
      {posts.length === 0 && (
        <p className="text-muted text-center">
          Le pagine sono ancora vuote... Scrivi la prima pagina del tuo diario!
        </p>
      )}

      {posts.length > 0 && (
        <HTMLFlipBook
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
            const pageNumber = index + 1 // numero pagina corretto

            return (
              <div
                key={p.id}
                className="page-background diary-page-size px-5 py-3 diary-page d-flex flex-column"
              >
                <h2 className="handwritten mb-3 fs-2">{p.titolo}</h2>

                <Card className="shadow-sm mb-4 mt-4 card-diario">
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
                      <p className="text-muted">Aggiungi un ricordo visivo</p>
                    </div>
                  )}
                </Card>

                <p className="diary-text">{p.contenuto}</p>

                {/* FOOTER PAGINA */}
                <div className="diary-footer mt-3">
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      Pagina scritta il giorno{" "}
                      {new Date(p.dataCreazione).toLocaleDateString()}
                    </small>

                    <Button
                      variant="outline-warning"
                      onClick={() => {
                        setSelectedPost(p)
                        setShowEdit(true)
                      }}
                    >
                      Modifica pagina
                    </Button>
                  </div>

                  <div className="text-end mt-2">
                    <small className="text-muted">
                      Pagina {pageNumber} di {totalPages}
                    </small>
                  </div>
                </div>
              </div>
            )
          })}
        </HTMLFlipBook>
      )}

      {/* Modale */}
      {selectedPost && (
        <ModificaPost
          show={showEdit}
          onHide={() => setShowEdit(false)}
          post={selectedPost}
          onSave={async ({ titolo, contenuto, fotoFile }) => {
            // aggiorna testo
            await fetch(`http://localhost:3001/posts/${selectedPost.id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                titolo,
                contenuto,
                idMonumento: selectedPost.idMonumento,
              }),
            })

            // aggiorna foto
            if (fotoFile) {
              const fd = new FormData()
              fd.append("file", fotoFile)

              await fetch(
                `http://localhost:3001/posts/${selectedPost.id}/foto`,
                {
                  method: "POST",
                  headers: { Authorization: `Bearer ${token}` },
                  body: fd,
                },
              )
            }

            // aggiorna localmente
            setPosts((prev) =>
              prev.map((p) =>
                p.id === selectedPost.id ? { ...p, titolo, contenuto } : p,
              ),
            )

            setShowEdit(false)
          }}
        />
      )}
    </Container>
  )
}
