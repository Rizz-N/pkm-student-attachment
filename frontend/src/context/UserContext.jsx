import { createContext, useContext, useState, useEffect } from "react";
import { getUsers } from "../services/getUsers";
import { clearAuthToken } from "../utils/axiosToken";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const saveUser = (data) => {
    setUser(data);
    localStorage.setItem(
      "userData",
      JSON.stringify({
        role: data.role,
        nama: data.guru?.nama_lengkap || data.nama,
        timestamp: Date.now(),
      })
    );
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("userData");
  };

  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getUsers.getUserLogin();
      if (data?.role) {
        saveUser(data);
        return data;
      }

      clearUser();
      return null;
    } catch (err) {
      clearUser();
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const setUserImmediately = (userData) => {
    saveUser(userData);
    setLoading(false);
  };

  const logout = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/logout`, {
        withCredentials: true,
      });
    } catch (_) {
      // ignore
    } finally {
      clearAuthToken();
      clearUser();
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) refreshUser();
    else setLoading(false);
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error,
        refreshUser,
        setUserImmediately,
        logout,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
