import { useEffect, useState } from "react"
import { ListGroup } from "react-bootstrap"

export default function PostDiario() {
  const [posts, setPosts] = useState([])
  const token = localStorage.getItem("token")

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
  }, [token])

  return (
    <>
      <h4 className="handwritten mt-4">Il mio diario</h4>

      <ListGroup>
        {posts.length === 0 && (
          <p className="text-muted">
            Le pagine sono ancora vuote... Scrivi la prima pagina del tuo
            diario!
          </p>
        )}
        {posts.map((p) => (
          <ListGroup.Item key={p.id}>
            <h5>{p.titolo}</h5>
            <p>{p.contenuto}</p>
            <small className="text-muted">
              Pubblicato il {new Date(p.dataCreazione).toLocaleDateString()}
            </small>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </>
  )
}
