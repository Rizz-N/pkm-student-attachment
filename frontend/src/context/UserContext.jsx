import { createContext, useContext, useState, useEffect } from "react";
import { getUsers } from "../services/getUsers";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setLoading(true);
      const data = await getUsers.getUserLogin();
      // console.log("data:", data);
      setUser(data || null);
      return data;
    } catch (err) {
      setUser(null);
      console.error("UserContext.refreshUser error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // load on mount
    refreshUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, refreshUser, loading }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
