import React, { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import FoodCard from "./FoodCard";
import axios from "axios";
import { useOrders } from "../OrdersContext";
import { useAuthToken } from "../AuthTokenContext";

const FoodGrid = ({ unregister }) => {
  const [posts, setPosts] = useState([]);
  const { orders, setOrders } = useOrders();
  const {accessToken, setAccessToken} = useAuthToken();

  useEffect(() => {
    const findPosts = async () => {
      let post = await axios.get(" http://localhost:8000/order");
      setPosts(post.data);
      setOrders(post.data);
    };
    findPosts();
  }, []); //Empty array is used to runt trigger this func only when this component is rendered for the first time

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
  if (unregister) {
    return items.slice(0, 8);
  } else {
    return items;
  }
};

export default FoodGrid;
