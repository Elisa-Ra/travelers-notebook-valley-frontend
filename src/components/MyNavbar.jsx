import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap"
import { Link } from "react-router-dom"
import { NavLink } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import { logout } from "../redux/store/authSlice"
import { BsBank2 } from "react-icons/bs"

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
        <Navbar.Brand as={NavLink} to="/" className="brand-taccuino">
          Traveller's Notebook
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={NavLink}
              to="/esplora"
              className="d-flex align-items-center gap-2"
            >
              <BsBank2 />
              <span>Esplora</span>
            </Nav.Link>
          </Nav>

          <Nav className="ms-auto">
            {user ? (
              <NavDropdown
                title={user.username}
                id="user-dropdown"
                className="dropdown-taccuino"
              >
                <NavDropdown.Item as={NavLink} to="/profilo">
                  Profilo
                </NavDropdown.Item>

                {user.ruolo === "ADMIN" && (
                  <NavDropdown.Item as={NavLink} to="/admin">
                    Admin Panel
                  </NavDropdown.Item>
                )}

                <NavDropdown.Item as={NavLink} to="/diario">
                  Diario
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Nav.Link as={NavLink} to="/login">
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
