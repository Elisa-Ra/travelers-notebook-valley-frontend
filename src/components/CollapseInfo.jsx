import { useState } from "react"
import { Button, Collapse } from "react-bootstrap"

function CollapseInfo({ children }) {
  const [open, setOpen] = useState(true)

  return (
    <>
      <div className="d-flex justify-content-center ">
        <Button
          onClick={() => setOpen(!open)}
          aria-controls="istruzioni-collapse"
          aria-expanded={open}
          variant="warning"
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
          <div className="istruzioni-box p-3">{children}</div>
        </div>
      </Collapse>
    </>
  )
}

export default CollapseInfo
