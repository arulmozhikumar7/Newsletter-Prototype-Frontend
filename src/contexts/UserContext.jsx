import React, { createContext, useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
// Create a context object for user authentication
const UserContext = createContext();

// Custom hook to consume the user authentication context
export const useUser = () => useContext(UserContext);

// UserProvider component to manage user authentication state
export const UserProvider = ({ children }) => {
  // State to hold user data, initialized from local storage if available
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // State to track user's login status
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );
  const navigate = useNavigate();
  // Function to handle user login
  const login = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  // Function to handle user logout
  const logout = () => {
    setUser(null);
    navigate("/");
    setIsLoggedIn(false);
    localStorage.removeItem("user");
    localStorage.removeItem("isLoggedIn");
  };

  // Function to retrieve user's ID
  const getUserId = () => {
    return user ? user._id : null;
  };

  // Function to retrieve user's admin status
  const getAdminStatus = () => {
    return user ? user.isAdmin : false;
  };

  const getPublications = () => {
    return user ? user.publications : [];
  };
  // Effect to update local storage when user data or login status changes
  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("isLoggedIn", isLoggedIn);
  }, [user, isLoggedIn]);

  // Provide user authentication state and functions to children components
  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        getUserId,
        getAdminStatus,
        getPublications,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
