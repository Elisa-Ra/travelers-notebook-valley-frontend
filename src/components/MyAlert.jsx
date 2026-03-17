import { useEffect } from "react"
import { Alert } from "react-bootstrap"

export default function MyAlert({ message, variant = "success", onClose }) {
  useEffect(() => {
    if (!message) return

    const timer = setTimeout(() => {
      onClose()
    }, 3000)

    return () => clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <Alert variant={variant} className="mb-3 text-center w-50 mx-auto">
      {message}
    </Alert>
  )
}
