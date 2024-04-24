import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import logo from "/images/TLlogo.svg"
import { Link } from 'react-router-dom'
import { CgProfile, CgLogOut, CgLogIn, CgSearch } from "react-icons/cg";
import { useState } from 'react'

function Header() {

  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      className='bg-body-tertiary'
      expand="md">
      <Container fluid className='sticky-top'>
        <Navbar.Brand href="/">
          {<img src={logo} width="250" height="50" alt="logo" className="d-inline-block align-top" />}{' '}
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-collapsable" />
        <Form className="d-flex justify-content-center flex-grow-1">
          <Form.Control
            type="search"
            placeholder="Search Tickets"
            className="m-2 .d-none .d-md-block .d-xl-none .d-xxl-none"
            aria-label="Search"
          />
        </Form>

        <Button variant="dark" onClick={toggleSearch} className={`d-md-none ${isSearchOpen ? 'd-none' : ''}`}>  {/* Added d-md-none and conditional class */}
          <CgSearch />
        </Button>

        <Navbar.Collapse className='justify-content-end' id="navbar-collapsable">
          <Nav>
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="catalog">Catalog</Nav.Link>
            <Nav.Link as={Link} to="past">Past Numbers</Nav.Link>
            <Nav.Link as={Link} to="orders">Order History</Nav.Link>
            <NavDropdown title={<CgProfile />} id="basic-nav-dropdown" align={{ md: "end" }} >
              <NavDropdown.Item>
                <Nav.Link as={Link} to="profile">
                  Profile
                </Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Nav.Link as={Link} to="logout">
                  Logout <CgLogOut />
                </Nav.Link>
              </NavDropdown.Item>
              <NavDropdown.Item>
                <Nav.Link as={Link} to="Login">
                  Login <CgLogIn />
                </Nav.Link>
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default Header