// import React, { createContext, useState, useEffect } from "react";

// export const UserContext = createContext();
// export const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // Load user from sessionStorage / localStorage on app load
//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem("studentUser") || "null");
//     if (storedUser) {
//       setUser(storedUser);
//     } else {
//       const sessionUser = JSON.parse(sessionStorage.getItem("studentUser") || "null");
//       if (sessionUser) setUser(sessionUser);
//     }
//   }, []);

//   const login = (student) => {
//     // Save to context
//     setUser(student);

//     // Save to sessionStorage & localStorage
//     sessionStorage.setItem("studentUser", JSON.stringify(student));
//     localStorage.setItem("studentUser", JSON.stringify(student));
//   };

//   const logout = () => {
//     setUser(null);
//     sessionStorage.removeItem("studentUser");
//     localStorage.removeItem("studentUser");
//   };

//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };



import React, { createContext, useState, useEffect } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage/sessionStorage
  useEffect(() => {
    const storedStudent = JSON.parse(localStorage.getItem("studentUser") || "null");
    const storedAdmin = JSON.parse(localStorage.getItem("adminUser") || "null");

    if (storedStudent) setUser(storedStudent);
    else if (storedAdmin) setUser(storedAdmin);
  }, []);

  const login = (userData) => {
    setUser(userData);

    if (userData.role === "student") {
      localStorage.setItem("studentUser", JSON.stringify(userData));
      sessionStorage.setItem("studentUser", JSON.stringify(userData));
    } else if (userData.role === "admin") {
      localStorage.setItem("adminUser", JSON.stringify(userData));
      sessionStorage.setItem("adminUser", JSON.stringify(userData));
    }
  };

  const logout = () => {
    if (user?.role === "student") {
      localStorage.removeItem("studentUser");
      sessionStorage.removeItem("studentUser");
    } else if (user?.role === "admin") {
      localStorage.removeItem("adminUser");
      sessionStorage.removeItem("adminUser");
    }
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
