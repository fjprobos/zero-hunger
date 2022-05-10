import React from "react";
import food from "../images/food.jpg";
import { Button } from "react-bootstrap";
import Row from "react-bootstrap/Row";
import FoodGrid from "../components/FoodGrid";
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate("/home");
  } else {
    return (
      <div className="landing">
        <img src={food} alt="food" className="foodImage" />
        <h2 className="imageText">Food Delivery Volunteer Website</h2>
        <Button
          variant="primary"
          id="signInButton"
          onClick={() => {
            navigate("/login");
          }}
        >
          LOGIN
        </Button>

        <div className="landingFoodContainer">
          <h2 className="foodNearYou">Food To Deliver Near You</h2>
          <Row xs={1} sm={1} md={2} lg={3} xl={4}>
            <FoodGrid unregister={true} />
          </Row>
        </div>
        <h3 className="signInText">Sign in to deliver food!</h3>
      </div>
    );
  }
};

export default Landing;
