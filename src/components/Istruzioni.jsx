import { useState } from "react"
import { Button, Collapse } from "react-bootstrap"
import { BsVectorPen } from "react-icons/bs"

function Istruzioni() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="d-flex justify-content-center">
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="istruzioni-collapse"
          aria-expanded={open}
        >
          Istruzioni
        </Button>
      </div>

      <Collapse in={open}>
        <div
          id="istruzioni-collapse"
          className="mt-2"
          style={{
            maxWidth: "100%",
            overflowX: "hidden",
          }}
        >
          <div className="istruzioni">
            In queste pagine potrai appuntare i tuoi pensieri e le tue
            sensazioni sui luoghi che visiterai durante il tuo viaggio. Potrai
            anche conservare le tue foto ricordo o i tuoi schizzi.{" "}
            <BsVectorPen />
          </div>
        </div>
      </Collapse>
    </>
  )
}

export default Istruzioni
