import React, { useEffect } from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";

import { LinkContainer } from "react-router-bootstrap";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/actions/userAction";
import { useNavigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useSessionContext } from "./SessionProvider";

const Header = () => {
  const { email } = useAppSelector((state: RootState) => state.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { getToken } = useSessionContext();

  const logoutHandler = async () => {
    await dispatch(logout());
    await getToken();
  };

  useEffect(() => {
    if (!email) navigate("/login");
  }, []);

  return (
    <header>
      <Navbar bg="primary" variant="dark" expand="lg" collapseOnSelect>
        <Container>
          <LinkContainer to="/home">
            <Navbar.Brand>
              <i className="mb-2 fas fa-home"> Home</i>
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {email ? (
              <div>
                <NavDropdown
                  className="navbar-nav text-capitalize"
                  title={email}
                  id="username"
                >
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </div>
            ) : (
              <LinkContainer to="/login">
                <Nav.Link>
                  <i className="fas fa-user"></i> Login
                </Nav.Link>
              </LinkContainer>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
