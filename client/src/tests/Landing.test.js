import {render, screen} from "@testing-library/react";
import Landing from "../pages/Landing";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

let mockIsAuthenticated = false;
const mockLoginWithRedirect = jest.fn();
const mockUseOrders = jest.fn();
const mockUseNavigate = jest.fn();

jest.mock("@auth0/auth0-react", () => ({
    ...jest.requireActual("@auth0/auth0-react"),
    Auth0Provider: ({ children }) => children,
    useAuth0: () => {
      return {
        isLoading: false,
        user: { sub: "foobar" },
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
    useOrders: () => {
      return mockUseOrders;
    },
  }));


// Now the actual tests

test("test texts on page", () => {
    render(
        <MemoryRouter initialEntries={["/"]}>
        <Landing/>
        </MemoryRouter>);
    expect(screen.getByText("Food To Deliver Near You")).toBeInTheDocument();
    expect(screen.getByText("Food Delivery Volunteer Website")).toBeInTheDocument();
    expect(screen.getByText("LOGIN")).toBeInTheDocument();
});

test("Login button navigates to login page", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Landing />
      </MemoryRouter>
    );
  
    const loginButton = screen.getByText("LOGIN");
    userEvent.click(loginButton);
  
    expect(mockUseNavigate).toHaveBeenCalledWith("/login");
  });

test("Navigate to Home when authenticated", () => {
    mockIsAuthenticated = true;
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Landing />
      </MemoryRouter>
    );
  
    expect(mockUseNavigate).toHaveBeenCalledWith("/home");
  });
