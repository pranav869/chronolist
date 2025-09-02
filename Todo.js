import React, { useState } from "react";
import "./todocss.css";
import PomodoroTimer from "./components/pomodarotimer";
import ThemeToggle from "./ThemeToggle";
import { GoogleCalendar } from "./GoogleCalendar";

export default function Todo() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [taskDate, setTaskDate] = useState("");
  const [taskTime, setTaskTime] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);

  const { signIn, signOut, addEventToCalendar, isSignedIn, profile } =
    GoogleCalendar();

  function addTask() {
    const text = newTask.trim();
    if (!text) return;
    setTasks((prev) => [text, ...prev]);
    setNewTask("");
  }

  function deleteTask(index) {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  }

  async function handleAddToCalendar(task) {
    if (!taskDate || !taskTime) {
      alert("Please pick a date and time for this task.");
      return;
    }
    await addEventToCalendar({
      summary: typeof task === "string" ? task : task?.text || "",
      description: "Task from ToDo App",
      date: taskDate,
      time: taskTime,
      durationMinutes,
    });
  }

  if (!isSignedIn) {
    return (
      <section className="signedout-screen">
        <div className="hero">
          <div className="hero-badge">New</div>
          <h1 className="hero-brand">Chronolist</h1>
          <div className="hero-badge">New</div>
          <h2 className="hero-title">Stay on track. Every day.</h2>
          <p className="hero-sub">
            A fast, simple To‑Do that syncs with Google Calendar so tasks become
            real events.
          </p>
          <ul className="feature-list">
            <li>Add tasks in one tap with smart keyboard focus</li>
            <li>One‑click “Add to Calendar” with start/end time</li>
            <li>Pomodoro timer built‑in for deep focus</li>
            <li>Light, Dark, and System themes</li>
          </ul>
          <div className="hero-ctas">
            <button onClick={signIn} className="cta-primary">
              <img
                src="https://developers.google.com/identity/images/g-logo.png"
                alt=""
              />
              Sign in with Google
            </button>
            <button
              className="cta-secondary"
              onClick={() =>
                window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
              }
            >
              Learn more
            </button>
          </div>
          <div className="hero-foot">
            <div className="kv">
              <strong>Private by design</strong>
              <span>Only signed‑in users can access the app</span>
            </div>
            <div className="kv">
              <strong>No clutter</strong>
              <span>Keyboard‑friendly, mobile‑ready</span>
            </div>
            <div className="kv">
              <strong>Free</strong>
              <span>No subscriptions or ads</span>
            </div>
          </div>
          <div className="theme-segment-wrap">
            <ThemeToggle />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="signedin-screen">
      <div className="todo-list">
        <h1 className="Head">TO DO LIST</h1>
        <div className="auth-bar">
          <div className="user">
            {profile?.picture ? (
              <img src={profile.picture} alt="" className="avatar" />
            ) : (
              <span className="avatar-initial">
                {(profile?.name || profile?.email || "U")
                  .trim()
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
            <div className="user-text">
              <div className="welcome">Welcome</div>
              <div className="name">{profile?.name || profile?.email}</div>
            </div>
          </div>
        </div>
        <div className="theme-segment-wrap">
          <ThemeToggle />
        </div>
        <div className="ji">Enter the tasks below</div>
        <div className="new-task">
          <input
            type="text"
            placeholder="Enter a new task"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className="tasko"
          />
          <input
            type="date"
            value={taskDate}
            onChange={(e) => setTaskDate(e.target.value)}
            aria-label="Task date"
            className="dateo"
          />
          <input
            type="time"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            aria-label="Task time"
            className="timeo"
          />
          <select
            value={durationMinutes}
            onChange={(e) => setDurationMinutes(parseInt(e.target.value, 10))}
            aria-label="Duration"
            className="durationo"
          >
            <option value={15}>15 min</option>
            <option value={25}>25 min</option>
            <option value={30}>30 min</option>
            <option value={45}>45 min</option>
            <option value={60}>60 min</option>
          </select>
          <button onClick={addTask} className="Add-button">Add</button>
        </div>
        <ol>
          {tasks.map((task, index) => (
            <li key={index}>
              <span className="text">{task}</span>
              <button className="delete-button" onClick={() => deleteTask(index)}>
                Delete
              </button>
              <button
                className="calendar-button"
                onClick={() => handleAddToCalendar(task)}
                disabled={!isSignedIn}
              >
                Add to Calendar
              </button>
            </li>
          ))}
        </ol>
        <PomodoroTimer />
        <div className="signout-wrap">
          <button onClick={signOut} className="btn-outline">Sign out</button>
        </div>
        <a href="https://pranavcv.neocities.org">Privacy policies</a>
        <br />
        <a href="https://www.termsfeed.com/live/872ca9eb-1cac-4aa5-b8fa-3c2fd85cf3f5">
          Terms and conditions
        </a>
      </div>
    </section>
  );
}
