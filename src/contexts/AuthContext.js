import React, { createContext, useContext, useEffect, useState } from "react";
import Loading from "../containers/Loading";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (!loading) {
      setLoadingMsg("");
    }
  }, [loading]);

  useEffect(() => {
    let token = localStorage.getItem("accessToken");
    if (token !== null) {
      setAccessToken(token);
    } else {
      setAccessToken(null);
    }
  }, []);

  useEffect(() => {
    // console.log("accessToken", accessToken);
    if (accessToken !== null && user === null) {
      getUser();
    }
  }, [accessToken]);

  async function getUser() {
    try {
      setLoading(true);
      setLoadingMsg("Getting user info...");
      const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
        headers: new Headers({
          Authorization: `Bearer ${accessToken}`,
        }),
      });
      const data = await res.json();
      //   console.log(data);
      if (data.email) {
        let currentUser = {
          email: data.email,
          givenName: data.given_name,
          familyName: data.family_name,
          name: data.name,
          imageUrl: data.picture,
          googleId: data.id,
        };
        setUser(currentUser);
      } else {
        setUser(null);
        setAccessToken(null);
      }
    } catch (error) {
      console.log(error);
      setAccessToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ accessToken, setAccessToken, user, setUser }}
    >
      {loading ? <Loading loadingMsg={loadingMsg} /> : children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
