import {render, screen} from "@testing-library/react";
import User from "../pages/User";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";

let mockIsAuthenticated = true;
const mockLoginWithRedirect = jest.fn();
const mockUseOrders = jest.fn();
const mockUseNavigate = jest.fn();
const user = {
  email: "test@gmail.com",
  name: "Jimmy Test",
  email_verified: true,
};

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
    useOrders: () => {
      return mockUseOrders;
    },
  }));


// Now the actual tests

test("Correct user data displayed on page", () => {
    mockIsAuthenticated = true;
    render(
        <MemoryRouter initialEntries={["/profile"]}>
          <User/>
        </MemoryRouter>);
    expect(screen.getByText("Email: " + user.email)).toBeInTheDocument();
});

test("Unauthorized message when not authenticated.", () => {
    mockIsAuthenticated = false;
    render(
      <MemoryRouter initialEntries={["/profile"]}>
        <User />
      </MemoryRouter>
    );
    expect(screen.getByText("You are not authorised to access this page!")).toBeInTheDocument();
  });
