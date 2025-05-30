import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [fullName, setFullName] = useState("Usuario");

  return (
    <UserContext.Provider value={{ fullName, setFullName }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
