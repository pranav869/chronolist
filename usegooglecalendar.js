import { useEffect, useState } from "react";
const gapi = window.gapi;

const CLIENT_ID = "YOUR_CLIENT_ID";
const API_KEY = "YOUR_API_KEY";
const SCOPES = "https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

export function useGoogleCalendar() {
  const [ready, setReady] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    function start() {
      gapi.client
        .init({ apiKey: API_KEY, clientId: CLIENT_ID, discoveryDocs: [DISCOVERY_DOC], scope: SCOPES })
        .then(() => {
          const auth = gapi.auth2.getAuthInstance();
          const update = () => {
            const signed = auth.isSignedIn.get();
            setIsSignedIn(signed);
            if (signed) {
              const p = auth.currentUser.get().getBasicProfile?.();
              setProfile(p ? { name: p.getName(), email: p.getEmail(), picture: p.getImageUrl() } : null);
            } else setProfile(null);
          };
          update();
          auth.isSignedIn.listen(update);
          setReady(true);
        })
        .catch((e) => console.error("GAPI init error:", e));
    }
    gapi.load("client:auth2", start);
  }, []);

  async function signIn() {
    if (!ready) return;
    await gapi.auth2.getAuthInstance().signIn();
  }
  function signOut() {
    try { gapi.auth2.getAuthInstance().signOut(); } catch {}
  }

  async function addEventToCalendar({ summary, description }) {
    if (!ready || !isSignedIn) return alert("Please sign in with Google first!");
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 60 * 1000);
    const event = {
      summary, description,
      start: { dateTime: now.toISOString(), timeZone: "Asia/Kolkata" },
      end: { dateTime: end.toISOString(), timeZone: "Asia/Kolkata" },
    };
    await gapi.client.calendar.events.insert({ calendarId: "primary", resource: event });
    alert("Event added to Google Calendar!");
  }

  return { signIn, signOut, addEventToCalendar, isSignedIn, profile, ready };
}
