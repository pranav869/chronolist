
import { useState } from "react";
import { useGoogleLogin, googleLogout } from "@react-oauth/google";

const SCOPES =
  "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
const CALENDAR_API = "https://www.googleapis.com/calendar/v3/calendars/primary/events";
const USERINFO = "https://www.googleapis.com/oauth2/v3/userinfo";

function makeDateTimes({ date, time, durationMinutes = 30, timeZone = "Asia/Kolkata" }) {
  const [y, m, d] = date.split("-").map(Number);
  const [hh, mm] = time.split(":").map(Number);
  const startLocal = new Date(y, m - 1, d, hh, mm, 0, 0);
  const endLocal = new Date(startLocal.getTime() + durationMinutes * 60 * 1000);
  return {
    start: { dateTime: startLocal.toISOString(), timeZone },
    end: { dateTime: endLocal.toISOString(), timeZone },
  };
}

export function GoogleCalendar() {
  const [accessToken, setAccessToken] = useState(null);
  const [profile, setProfile] = useState(null);

  const login = useGoogleLogin({
    onSuccess: async ({ access_token }) => {
      setAccessToken(access_token);
      try {
        const res = await fetch(USERINFO, { headers: { Authorization: `Bearer ${access_token}` } });
        const data = await res.json();
        setProfile({ name: data.name, email: data.email, picture: data.picture });
      } catch {}
    },
    onError: () => {},
    scope: SCOPES,
    flow: "implicit",
  });

  function signOut() {
    try { googleLogout(); } catch {}
    setAccessToken(null);
    setProfile(null);
  }
  
  
  async function addEventToCalendar({ summary, description, date, time, durationMinutes = 30, timeZone = "Asia/Kolkata" }) {
    if (!accessToken) return alert("Please sign in with Google first!");
    if (!date || !time) return alert("Please pick a date and time.");

    const { start, end } = makeDateTimes({ date, time, durationMinutes, timeZone });
    const event = { summary, description, start, end };

    const response = await fetch(CALENDAR_API, {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      body: JSON.stringify(event),
    });

    if (!response.ok) return alert("Failed to add event. Please sign in again.");
    alert("Event added to Google Calendar!");
  }

  return {
    signIn: login,
    signOut,
    addEventToCalendar,
    isSignedIn: !!accessToken,
    profile,
  };
}
