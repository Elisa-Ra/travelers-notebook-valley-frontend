import { useEffect, useState } from "react"
import { ListGroup, Pagination } from "react-bootstrap"

export default function PostDiario({ refresh }) {
  const [posts, setPosts] = useState([])
  const token = localStorage.getItem("token")

  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 1

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
  // paginazione
  const totalPages = Math.ceil(posts.length / postsPerPage)
  const indexOfLast = currentPage * postsPerPage
  const indexOfFirst = indexOfLast - postsPerPage
  const currentPosts = posts.slice(indexOfFirst, indexOfLast)

  return (
    <>
      <h4 className="handwritten mt-4">Il mio diario</h4>

      {posts.length > 0 && (
        <p className="text-muted">
          Pagina {currentPage} di {totalPages}
        </p>
      )}

      <ListGroup>
        {posts.length === 0 && (
          <p className="text-muted">
            Le pagine sono ancora vuote... Scrivi la prima pagina del tuo
            diario!
          </p>
        )}

        {currentPosts.map((p) => (
          <ListGroup.Item key={p.id}>
            <h5>{p.titolo}</h5>
            <p>{p.contenuto}</p>
            <small className="text-muted">
              Pagina scritta il {new Date(p.dataCreazione).toLocaleDateString()}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>

      {/* PAGINAZIONE */}
      {totalPages > 1 && (
        <Pagination className="mt-3 justify-content-center">
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          />

          {[...Array(totalPages)].map((_, i) => (
            <Pagination.Item
              key={i}
              active={i + 1 === currentPage}
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </Pagination.Item>
          ))}

          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          />
        </Pagination>
      )}
    </>
  )
}
