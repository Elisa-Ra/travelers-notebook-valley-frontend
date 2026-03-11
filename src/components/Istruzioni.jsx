import { useState } from "react"
import { Container } from "react-bootstrap"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Collapse from "react-bootstrap/Collapse"
import { BsVectorPen } from "react-icons/bs"

function Istruzioni() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <Container className="text-center mx-auto">
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          Istruzioni
        </Button>
        <div style={{ minHeight: "150px" }} className="m-0 p-0 mt-2">
          <Collapse in={open} dimension="width">
            <div id="example-collapse-text">
              <Card body style={{ width: "400px" }}>
                In queste pagine potrai appuntare i tuoi pensieri e le tue
                sensazioni sui luoghi che visiterai durante il tuo viaggio.
                Potrai anche conservare le tue foto ricordo o i tuoi schizzi.{" "}
                <BsVectorPen />
              </Card>
            </div>
          </Collapse>
        </div>
      </Container>
    </>
  )
}

export default Istruzioni
