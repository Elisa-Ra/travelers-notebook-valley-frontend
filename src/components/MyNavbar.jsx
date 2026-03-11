import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/store/authSlice"

function MyNavbar() {
  const dispatch = useDispatch()

  // Leggo l'utente dallo store Redux
  const user = useSelector((state) => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <Navbar expand="lg" className="navbar-color border-bottom border-1 fs-5">
      <Container>
        <Navbar.Brand as={Link} to="/" className="brand-taccuino">
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
            {user ? (
              <NavDropdown
                title={user.username}
                id="user-dropdown"
                className="dropdown-taccuino"
              >
                <NavDropdown.Item as={Link} to="/profilo">
                  Profilo
                </NavDropdown.Item>

                {user.ruolo === "ADMIN" && (
                  <NavDropdown.Item as={Link} to="/admin">
                    Admin Panel
                  </NavDropdown.Item>
                )}

                <NavDropdown.Divider />
                <NavDropdown.Item as={Link} to="/diario">
                  Diario
                </NavDropdown.Item>
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default MyNavbar
