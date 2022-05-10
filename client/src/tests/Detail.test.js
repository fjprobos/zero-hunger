import {render, screen} from "@testing-library/react";
import Detail from "../pages/Detail";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { OrdersProvider, useOrders } from "../OrdersContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

let mockIsAuthenticated = true;
const mockLoginWithRedirect = jest.fn();
const mockUseNavigate = jest.fn();
const user = {
  email: "test@gmail.com",
  name: "Jimmy Test",
  email_verified: true,
};
const orders = [{
  deliveryAddress: "333 Seymour St, Vancouver, BC V6B 5A7",
  deliveryStatus: true,
  id: "625909ea19636d01475d8380",
  orderImageUrl: "https://cdn.pixabay.com/photo/2021/09/25/18/54/dish-6655595_960_720.jpg",
  orderName: "Pizza",
  pickupAddress: " 410 W Georgia St, Vancouver, BC V6B 1Z3"
}]

const orderId = "625909ea19636d01475d8380";

jest.mock("@auth0/auth0-react", () => ({
    ...jest.requireActual("@auth0/auth0-react"),
    Auth0Provider: ({ children }) => children,
    useAuth0: () => {
      return {
        isLoading: false,
        user,
        isAuthenticated: mockIsAuthenticated,
        loginWithRedirect: mockLoginWithRedirect,
      };
    },
  }));

jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => {
      return mockUseNavigate;
    },
  }));

jest.mock("../AuthTokenContext", () => ({
    useAuthToken: () => {
        return { accessToken: "123" };
      },
  }));

jest.mock("../OrdersContext", () => ({
  ...jest.requireActual("../OrdersContext"),
    OrdersProvider: ({ children }) => children,
    useOrders: () => {
      return {
        orders: orders
      };
    }
  }));


// Now the actual tests

test("Correct name of order displayed on page", () => {
    mockIsAuthenticated = true;
    render(
      <MemoryRouter initialEntries={["/detail/"+orderId]}>
          <Routes>
            <Route path="/detail/:orderId" element={<Detail />} /> 
          </Routes>
      </MemoryRouter>);
    expect(screen.getByText("Pizza")).toBeInTheDocument();
});

test("Unauthorized message when not authenticated.", () => {
    mockIsAuthenticated = false;
    render(
      <MemoryRouter initialEntries={["/detail/"+orderId]}>
        <Routes>
          <Route path="/detail/:orderId" element={<Detail />} /> 
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText("You are not authorised to access this page!")).toBeInTheDocument();
  });
