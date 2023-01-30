/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import "./App.css";
import NotificationSound from "./notification.wav";

function App() {
  const [inputTime, setInputTime] = useState(
    JSON.parse(localStorage.getItem("duration"))
  );
  const [value, setValue] = useState("");
  const [startTime, setStartTime] = useState(new Date(localStorage.getItem("startTime")));
  const [running, setRunning] = useState(
    JSON.parse(localStorage.getItem("status"))
  );
  const [currentTime, setCurrentTime] = useState();
  const [second, setSecond] = useState(
    JSON.parse(localStorage.getItem("second"))
  );
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const handleInput = (e) => {
    setInputTime(e.target.value);
    setValue(e.target.value);
  };

  const setReminder = (e) => {
    let time = new Date();
    localStorage.setItem("startTime", time);
    setStartTime(time);
    setRunning(true);
    localStorage.setItem("status", JSON.stringify(true));
    localStorage.setItem("duration", inputTime);
    setValue("");
    e.preventDefault();
  };

  useEffect(() => {
    setCurrentTime(new Date());
  }, [second]);

  useEffect(() => {
    if (running) {
      const interval = setInterval(() => {
        setSecond((second) => {
          return second + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [running]);

  useEffect(() => {
    if (running) {
      let time = new Date(startTime);
      let differenceInMinutes = ((currentTime - time) / (1000 * 60)) * 60;

      if (Math.floor(differenceInMinutes / 60) >= 0) {
        setMinutes(Math.floor(differenceInMinutes / 60));
        setSeconds(Math.floor(differenceInMinutes % 60));
      }

      if (Math.floor(differenceInMinutes) / 60 >= inputTime) {
        localStorage.setItem("status", JSON.stringify(false));
        localStorage.setItem("second", JSON.stringify(0));
        localStorage.setItem("duration", 0);
        setRunning(false);
        playAudio();
        window.location.href = "#demo-modal";
      }
      localStorage.setItem("second", JSON.stringify(second));
    }
  }, [second]);

  const audioPlayer = useRef(null);

  function playAudio() {
    audioPlayer.current.play();
  }

  return (
    <div className="App">
      <div className="showcase">
        <h1>Relax Reminder</h1>
        <form onSubmit={setReminder}>
          <input value={value} type="number" onChange={handleInput} />
          <button type="submit">Set Reminder</button>
        </form>
        {running && (
          <div>
            <h1>
              Your are working since{" "}
              {startTime.toLocaleString("en-US", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}{" "}
            </h1>
            <small>You will be notify with in {inputTime} minutes.</small>
            <br />
            <small>
              Working for {minutes} : {seconds}
            </small>
          </div>
        )}
      </div>
      <audio ref={audioPlayer} src={NotificationSound} />
      <div id="demo-modal" className="modal">
        <div className="modal__content">
          <h1>Hay take a break.</h1>
          <p>
            You have been working for last {minutes} minutes. You should take a
            rest. Have a relax!
          </p>
          <a href="#" className="modal__close">
            &times;
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;
