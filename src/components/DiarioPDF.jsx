import { Button } from "react-bootstrap"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

export default function DiarioPDF({ posts }) {
  const downloadDiary = async () => {
    if (!posts || posts.length === 0) return

    document.body.classList.add("diary-print-mode")

    const pages = document.querySelectorAll(".diary-page")
    if (!pages.length) return

    const pdf = new jsPDF("p", "mm", "a4")
    let firstPage = true

    for (const page of pages) {
      const canvas = await html2canvas(page, {
        scale: 2,
        useCORS: true,
      })

      const imgData = canvas.toDataURL("image/png")
      const imgWidth = 210
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      if (!firstPage) pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)

      firstPage = false
    }

    document.body.classList.remove("diary-print-mode")
    pdf.save("diario.pdf")
  }

  return (
    <div className="text-center my-3">
      <Button variant="success" onClick={downloadDiary}>
        Scarica il tuo diario
      </Button>
    </div>
  )
}
