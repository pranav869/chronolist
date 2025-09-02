// auth/useGoogleAuth.js
import { useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

const SCOPES = "openid https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
const USERINFO = "https://www.googleapis.com/oauth2/v3/userinfo";

export function useGoogleAuth() {
  const [token, setToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const signIn = useGoogleLogin({
    scope: SCOPES,
    flow: "implicit",
    onSuccess: async ({ access_token }) => {
      setToken(access_token);
      const res = await fetch(USERINFO, { headers: { Authorization: `Bearer ${access_token}` } });
      const data = await res.json();
      setProfile({ name: data.name, email: data.email, picture: data.picture });
    },
    onError: () => {},
  });

  function signOut() {
    try { googleLogout(); } catch {}
    setToken(null);
    setProfile(null);
  }

  return { signIn, signOut, isSignedIn: !!token, profile };
}
