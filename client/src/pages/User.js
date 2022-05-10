import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button, Navbar, Row, Nav, Container, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import UserGrid from "../components/UserGrid";
import axios from "axios";

const User = () => {
  const { isAuthenticated, logout, user } = useAuth0();
  const [name, setName] = useState("");
  const [edit, setEdit] = useState(false);
  const apiUrl = "http://localhost:8000/user/" + user.email;

  useEffect(() => {
    const findName = async () => {
      let post = await axios.get(apiUrl);
      setName(post.data.name);
    };
    findName();
  }, [apiUrl]);

  const saveEdit = async () => {
    await axios.patch(apiUrl, { newName: name });
  };

  const editDetails = () => {
    setEdit(!edit);
  };

  const handleChange = (event) => {
    setName(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    saveEdit();
    editDetails();
  };

  if (!isAuthenticated) {
    return <h1>You are not authorised to access this page!</h1>;
  } else {
    return (
      <div>
        <Navbar bg="dark" variant="dark">
          <Container>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>
              <Nav.Link as={Link} className="active" to="/profile">
                {name}
              </Nav.Link>
            </Nav>
            <Form>
              <Button
                variant="danger"
                onClick={() => {
                  logout();
                }}
              >
                LOGOUT
              </Button>
            </Form>
          </Container>
        </Navbar>

        <div className="userInfo">
          {!edit && <p>Name: {name}</p>}
          {edit && (
            <form onSubmit={(e) => handleSubmit(e)}>
              <label>
                Name:
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleChange(e)}
                />
              </label>
              <input type="submit" value="Submit" />
            </form>
          )}
          <p>Email: {user.email}</p>
          <Button onClick={() => editDetails()}>Edit Details</Button>
        </div>
        <div className="ordersDelivered">
          <div className="landingFoodContainer">
            <h2>Orders Delivered</h2>
            <Row xs={1} sm={1} md={2} lg={3} xl={4}>
              <UserGrid email={user.email} />
            </Row>
          </div>
        </div>
      </div>
    );
  }
};

export default User;
