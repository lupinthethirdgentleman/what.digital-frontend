import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import { useAppDispatch } from "../../redux/hooks";
import { login } from "../../redux/actions/userAction";
import { useSessionContext } from "../../components/SessionProvider";
const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { token } = useSessionContext();
  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(login(username, password, token));
    navigate("/home");
  };

  return (
    <div>
      <Row className="justify-content-md-center">
        <Col xs={12} md={6}>
          <h1>Sign In</h1>
          <Form onSubmit={submitHandler}>
            <Form.Group className="py-3" controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                placeholder="enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type="submit" variant="primary">
              Sign In
            </Button>
          </Form>

          <Row className="py-3">
            <Col>
              Do not have an account?
              <Link to={`/register`}> Register</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
