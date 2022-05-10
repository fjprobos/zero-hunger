import React, { useState } from "react";
import { Card, Button } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import { AiOutlineFileSearch } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { useAuthToken } from "../AuthTokenContext";
import axios from "axios";

function FoodCard({
  id,
  url,
  name,
  pickupAddress,
  deliveryAddress,
  deliveryStatus,
}) {
  const { isAuthenticated, user } = useAuth0();
  const [status, setStatus] = useState(deliveryStatus);
  const {accessToken, setAccessToken} = useAuthToken();
  const navigate = useNavigate();

  const deliver = () => {
    if (isAuthenticated) {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };
      const markDelivered = async () => {
        const email = user.email;
        const orderDetails = { orderId: id, userEmailId: email };
        await axios.patch("http://localhost:8000/order/" + id, {},config);
        await axios.post("http://localhost:8000/history", orderDetails, config);
      };
      markDelivered();
      setStatus(true);
    } else {
      navigate("/login");
    }
  };

  const gotoDetail = () => {
    if (isAuthenticated) {
      navigate("/detail/" + id);
    } else {
      navigate("/login");
    }
  };

  return (
    <Card border="dark" style={{ width: "16rem" }}>
      <Card.Img variant="top" height="150px" width="100px" src={url} />
      <Card.Body>
        <Card.Title>{name}</Card.Title>
        <Card.Text>Pickup Address : {pickupAddress}</Card.Text>
        <Card.Text>Delivery Address : {deliveryAddress}</Card.Text>
        {isAuthenticated && !status && (
          <Button variant="outline-primary" onClick={() => deliver()}>
            DELIVER
          </Button>
        )}
        {isAuthenticated && status && (
          <Button variant="success">DELIVERED</Button>
        )}
        <Button
          className="detailButton"
          variant="outline-dark"
          onClick={() => gotoDetail()}
        >
          <AiOutlineFileSearch size={21} />
        </Button>
      </Card.Body>
    </Card>
  );
}

export default FoodCard;
