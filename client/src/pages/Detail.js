import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";
import GoogleMapReact from "google-map-react";
import axios from "axios";
import { useOrders } from "../OrdersContext";

const Detail = () => {
  const { isAuthenticated, user } = useAuth0();
  const [name, setName] = useState("");
  const params = useParams();
  const orderId = params.orderId;
  const { orders } = useOrders();

  const order = orders.filter((obj) => {
    return obj.id === orderId;
  })[0];

  // Google API part
  const [distance, setDistance] = useState();
  const apikey = process.env.API_KEY;
  const AnyReactComponent = ({ text }) => <div>{text}</div>;
  const defaultProps = {
    center: {
      lat: 49.301962,
      lng: -123.147276,
    },
    zoom: 11,
  };

  const handleApiLoaded = (map, maps, pickupAddress, deliveryAddress) => {
    var service = new maps.DistanceMatrixService();
    var geocoder = new maps.Geocoder();

    // Centering the map in the delivery location
    geocoder.geocode({ address: deliveryAddress }, function (results, status) {
      if (status === "OK") {
        map.setCenter(results[0].geometry.location);
        var marker = new maps.Marker({
          map: map,
          position: results[0].geometry.location,
        });
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });

    // Getting the travel distance
    var dist = service.getDistanceMatrix(
      {
        origins: [pickupAddress],
        destinations: [deliveryAddress],
        travelMode: "DRIVING",
        avoidHighways: false,
        avoidTolls: false,
      },
      callback
    );

    function callback(response, status) {
      if (status === "OK") {
        var rows = response.rows;
        for (var i = 0; i < rows.length; i++) {
          var results = response.rows[i].elements;
          for (var j = 0; j < results.length; j++) {
            var element = results[j];
            if (element.status === "OK") {
              setDistance(element.distance.text);
            }
            break;
          }
        }
      }
    }
  };

  // Wikipedia part

  let url =
    "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exlimit=1&explaintext&origin=*&titles=" +
    order.orderName;

  const [info, setInfo] = useState([]);
  let text;

  useEffect(() => {
    const findInfo = async () => {
      let post = await axios.get(url);
      let name = await axios.get("http://localhost:8000/user/" + user.email);
      setName(name.data.name);
      setInfo(post.data);
    };
    findInfo();
  }, [url]);

  if (Object.keys(info).length > 0) {
    let id;
    for (const property in info.query.pages) {
      id = property;
    }
    text = info.query.pages[id].extract;
  }

  if (!isAuthenticated) {
    return <h1>You are not authorised to access this page!</h1>;
  } else {
    return (
      <div className="wikipediaPage">
        <Navbar bg="dark" variant="dark">
          <Container>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/home">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/profile">
                {name}
              </Nav.Link>
              <Nav.Link className="active">Details</Nav.Link>
            </Nav>
          </Container>
        </Navbar>
        <h2 className="wikipediaTitle">{order.orderName}</h2>
        <h5>Pickup Address: {order.pickupAddress}</h5>
        <h5>Delivery Address: {order.deliveryAddress}</h5>
        <h5>Task distance : {distance}</h5>
        <div style={{ height: "60vh", width: "80%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{
              key: "AIzaSyD8RGdLpen_babX7atlB5kv3_01tU_nSCI",
            }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            yesIWantToUseGoogleMapApiInternals
            onGoogleApiLoaded={({ map, maps }) =>
              handleApiLoaded(
                map,
                maps,
                order.pickupAddress,
                order.deliveryAddress
              )
            }
          >
            <AnyReactComponent
              lat={49.301962}
              lng={-123.147276}
              text="Delivery Location"
            />
          </GoogleMapReact>
        </div>
        <p className="wikipediaParagraph">{text}</p>
      </div>
    );
  }
};

export default Detail;
