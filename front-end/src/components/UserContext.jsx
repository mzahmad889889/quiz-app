import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // load user from localStorage when app loads
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("studentUser") || "null");
    if (storedUser) setUser(storedUser);
  }, []);

  const login = (student) => {
    localStorage.setItem("studentUser", JSON.stringify(student));
    setUser(student);
  };

  const logout = () => {
    localStorage.removeItem("studentUser");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
