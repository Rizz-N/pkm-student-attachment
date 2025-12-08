import { createContext, useContext, useState, useEffect } from "react";
import { getUsers } from "../services/getUsers";
import { clearAuthToken } from "../utils/axiosToken";
import axios from "axios";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshUser = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getUsers.getUserLogin();
      // console.log("data di usecontext:", data);

      if (data && data.role) {
        setUser(data);
        localStorage.setItem(
          "userData",
          JSON.stringify({
            role: data.role,
            nama: data.guru?.nama_lengkap || data.nama,
            timestamp: Date.now(),
          })
        );
        try {
          window.dispatchEvent(new Event("userChanged"));
        } catch (e) {
          /* ignore in non-browser env */
        }
      } else {
        setUser(null);
        localStorage.removeItem("userData");
        try {
          window.dispatchEvent(new Event("userChanged"));
        } catch (e) {
          /* ignore in non-browser env */
        }
      }
      return data;
    } catch (err) {
      console.error("UserContext.refreshUser error:", err);
      setError(err.message);
      setUser(null);
      localStorage.removeItem("userData");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const setUserImmediately = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem(
        "currentUser",
        JSON.stringify({
          role: userData.role,
          id: userData.id,
          timestamp: Date.now(),
        })
      );
      try {
        window.dispatchEvent(new Event("userChanged"));
      } catch (e) {
        /* ignore in non-browser env */
      }
    }
  };

  const startLoading = () => setLoading(true);

  const logout = async () => {
    try {
      await axios.delete("http://localhost:5000/logout", {
        withCredentials: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      clearAuthToken();
      setUser(null);
      localStorage.removeItem("userData");
      try {
        window.dispatchEvent(new Event("userChanged"));
      } catch (e) {
        /* ignore in non-browser env */
      }
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        refreshUser,
        logout,
        loading,
        error,
        startLoading,
        setUserImmediately,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
