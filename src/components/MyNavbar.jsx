import { Container, Nav, Navbar } from "react-bootstrap"
import { Link } from "react-router-dom"

function MyNavbar() {
  return (
    <Navbar expand="lg" className="navbar-color border-bottom border-1 fs-5">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Traveller's Notebook
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/esplora">
              Esplora
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/login">
              Login
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
