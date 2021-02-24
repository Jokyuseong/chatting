import "./App.css";
import { useState, useEffect } from "react";
import socketIOClient from "socket.io-client";

const socket = socketIOClient("localhost:4002");

const rooms = ["room1", "room2", "room3", "room4"];

function App() {
  const [messages, setMessages] = useState([]);
  const [name, setName] = useState("");
  const [value, setValue] = useState("");
  const [joinedRoom, setJoinedRoom] = useState("room1");

  const sendMessage = () => {
    socket.emit("send message", { name, message: value, joinedRoom });
  };

  const roomChangeHandler = (room) => {
    console.log(room);
    socket.emit("change room", { prev: joinedRoom, next: room }, name);
    setJoinedRoom(room);
  };

  useEffect(() => {
    socket.on("receive message", (item) => {
      console.log(messages.push(item), "<<");
      console.log(messages);
      setMessages([...messages]);
    });

    socket.emit("change room", { prev: "", next: joinedRoom }, name);
  }, []);

  return (
    <div className="App">
      <div>
        {messages.map((message) => {
          if (message.name === "notice") {
            return <p style={{ color: "blue" }}>{message.message}</p>;
          }
          if (message.name === name) {
            return <p style={{ color: "red" }}>me : {message.message}</p>;
          }
          return (
            <p>
              {message.name} : {message.message}
            </p>
          );
        })}
        <input value={name} onInput={(e) => setName(e.target.value)} />
        <input value={value} onInput={(e) => setValue(e.target.value)} />
        <button onClick={sendMessage}>전송</button>
        {rooms.map((room) => (
          <div>
            <button onClick={() => roomChangeHandler(room)}>{room}</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
