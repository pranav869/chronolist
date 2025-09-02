import { useEffect, useState } from "react";
import './todocss.css';
const gapi = window.gapi;


const CLIENT_ID = "777827217342-vdh8dtdael581k2qro1p2abgn222vakm.apps.googleusercontent.com";
const API_KEY = "AIzaSyAB2T4k_RJDPLMldaHmZugSPwT57JEMh1Y";
const SCOPES = "https://www.googleapis.com/auth/calendar.events";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";

export function useGoogleCalendar() {
  const [gapiInitialized, setGapiInitialized] = useState(false);
  
  
  useEffect(() => {
    function start() {
      gapi.client
        .init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: [DISCOVERY_DOC],
          scope: SCOPES,
        })
        .then(() => {
          setGapiInitialized(true);
        })
        .catch((error) => {
          console.error("GAPI client init error:", error);
        });
    }

    gapi.load("client:auth2", start);
  }, []);

  async function signIn() {
    try {
      
      await gapi.auth2.getAuthInstance().signIn();
      alert("Signed in with Google!");
    } catch (error) {
      console.error("Google sign-in error:", error);
      
    }
  }

  async function addEventToCalendar({ summary, description }) {
    try {
      if (!gapiInitialized) {
        alert("Google API not yet initialized. Please try again.");
        return;
      }

      const isSignedIn = gapi.auth2.getAuthInstance().isSignedIn.get();
      if (!isSignedIn) {
        await gapi.auth2.getAuthInstance().signIn();
      }

      const now = new Date();
      const end = new Date(now.getTime() + 30 * 60 * 1000);

      const event = {
        summary,
        description,
        start: {
          dateTime: now.toISOString(),
          timeZone: "Asia/Kolkata",
        },
        end: {
          dateTime: end.toISOString(),
          timeZone: "Asia/Kolkata",
        },
      };

      await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });

      
    
      
      alert("Event added to Google Calendar!");
    
   
    } catch (error) {
      console.error("Add to calendar error:", error);
      alert("Failed to add event. Please sign in again.");
    }
  }

  return { signIn, addEventToCalendar };
}
