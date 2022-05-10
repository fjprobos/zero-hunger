import React, { useState, useEffect } from "react";
import Col from "react-bootstrap/Col";
import FoodCard from "./FoodCard";
import axios from "axios";
import { useAuthToken } from "../AuthTokenContext";

const UserGrid = ({ email }) => {
  const [posts, setPosts] = useState([]);
  const {accessToken, setAccessToken} = useAuthToken();

  useEffect(() => {
    const findPosts = async (id) => {
      let find = await axios.get(" http://localhost:8000/order/" + id);
      setPosts((oldArray) => [...oldArray, find.data]);
    };
    const findDelivery = async () => {
      const config = {
        headers: { Authorization: `Bearer ${accessToken}` }
      };
      let find = await axios.get(" http://localhost:8000/history/" + email, config);

      for (let i = 0; i < find.data.length; i++) {
        findPosts(find.data[i].orderId);
      }
    };
    findDelivery();
  }, [email]);

  let items = posts.map((post, index) => {
    return (
      <Col key={index}>
        <FoodCard
          id={post.id}
          url={post.orderImageUrl}
          name={post.orderName}
          deliveryAddress={post.deliveryAddress}
          pickupAddress={post.pickupAddress}
          deliveryStatus={post.deliveryStatus}
        />
      </Col>
    );
  });
  if (items.length === 0) {
    return <h3>Nothing yet :)</h3>;
  }
  return items;
};

export default UserGrid;
