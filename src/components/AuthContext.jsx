import React, { createContext, useState} from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize token state from localStorage (if exists)
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // Function to update token in state and localStorage
  const login = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};












// import React, { createContext, useState, useEffect } from "react";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [token, setToken] = useState(() => localStorage.getItem("token") || null);

//   useEffect(() => {
//     if (token) {
//       localStorage.setItem("token", token);
//     } else {
//       localStorage.removeItem("token");
//     }
//   }, [token]);

//   const logout = () => setToken(null);

//   return (
//     <AuthContext.Provider value={{ token, setToken, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
