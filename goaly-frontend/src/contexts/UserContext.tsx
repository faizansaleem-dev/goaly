import React, { createContext, useReducer, useContext, ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginUser, register as registerUser } from "../api/user";

// Define User interface
interface User {
  username: string;
  token: string;
}

// Define the shape of our context's state
interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

// Define the context's actions and state together in one interface
interface AuthContextType extends UserState {
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

// Define the actions for the reducer
type Action =
  | { type: "LOGIN_REQUEST" }
  | { type: "LOGIN_SUCCESS"; payload: User }
  | { type: "LOGIN_FAILURE"; error: string }
  | { type: "REGISTER_REQUEST" }
  | { type: "REGISTER_SUCCESS"; payload: User }
  | { type: "REGISTER_FAILURE"; error: string }
  | { type: "LOGOUT" };

// Initial state for the reducer
const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// Create the context
const UserContext = createContext<AuthContextType | undefined>(undefined);

// Reducer function
function userReducer(state: UserState, action: Action): UserState {
  switch (action.type) {
    case "LOGIN_REQUEST":
    case "REGISTER_REQUEST":
      return { ...state, loading: true, error: null };
    case "LOGIN_SUCCESS":
    case "REGISTER_SUCCESS":
      return { ...state, user: action.payload, loading: false, error: null };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
      return { ...state, loading: false, error: action.error };
    case "LOGOUT":
      return { ...state, user: null, loading: false, error: null };
    default:
      return state;
  }
}

// UserProvider component
export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(userReducer, initialState);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    dispatch({ type: "LOGIN_REQUEST" });

    try {
      const data = await loginUser(username, password);
      const user = { username, token: data.access_token };
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (error: any) {
      dispatch({
        type: "LOGIN_FAILURE",
        error: error.message || "An error occurred",
      });
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    dispatch({ type: "REGISTER_REQUEST" });

    try {
      const data = await registerUser(username, email, password);
      const user = { username, token: data.access_token };
      dispatch({ type: "REGISTER_SUCCESS", payload: user });
      localStorage.setItem("token", data.access_token);
      navigate("/dashboard");
    } catch (error: any) {
      dispatch({
        type: "REGISTER_FAILURE",
        error: error.message || "An error occurred",
      });
    }
  };

  const logout = () => {
    dispatch({ type: "LOGOUT" });
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <UserContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default UserContext;
