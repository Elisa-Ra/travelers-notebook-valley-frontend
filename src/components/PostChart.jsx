import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import { useEffect, useState } from "react"

export default function PostChart() {
  const [stats, setStats] = useState([])
  const token = localStorage.getItem("token")

  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("http://localhost:3001/posts/stats/monumenti", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (res.ok) {
        const data = await res.json()
        setStats(data)
      }
    }

    fetchStats()
  }, [token])

  return (
    <>
      <h4 className="mb-4 pt-4 text-center">Statistiche: Post per Monumento</h4>
      <div className="d-flex justify-content-center">
        <ResponsiveContainer width="99%" height={450}>
          <BarChart
            width={700}
            height={450}
            data={stats}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="10 10" />
            <XAxis type="number" />
            <YAxis
              type="category"
              dataKey="nome"
              width={150}
              tick={{ className: "handwritten" }}
            />
            {/* Il popup */}
            <Tooltip />
            <Bar dataKey="posts" fill="#e6b800" barSize={25} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  )
}
