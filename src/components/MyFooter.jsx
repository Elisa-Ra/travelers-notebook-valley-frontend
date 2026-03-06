import Container from "react-bootstrap/Container"

const MyFooter = () => {
  return (
    <>
      <footer className=" navbar-color mt-1 pt-2 w-100">
        <Container className="text-center">
          <small>
            {" "}
            2026 Traveller's Notebook - Valley Edition © By{" "}
            <a
              href="https://github.com/Elisa-Ra"
              target="_blank"
              rel="noopener noreferrer"
              className="link"
            >
              Elisa Raeli{" "}
            </a>
          </small>
        </Container>
      </footer>
    </>
  )
}

export default MyFooter
