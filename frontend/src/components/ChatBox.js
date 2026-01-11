import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:8080");

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const userObj = JSON.parse(localStorage.getItem("user"));
  const user = userObj?.user;
  const username = user ? user.full_name : "Guest";
  const userId = user ? user.id : null;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/chat");

        const history = res.data.map((msg) => {
          let timeString = "";
          try {
            timeString = msg.created_at
              ? new Date(msg.created_at).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                });
          } catch (e) {
            timeString = "";
          }

          return {
            author: msg.sender ? msg.sender.full_name : "Anonymous",
            message: msg.content,
            time: timeString,
          };
        });
        setMessageList(history);
      } catch (err) {
        console.log("Error loading chat:", err);
      }
    };

    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageList((list) => [...list, data]);
    });
    return () => socket.off("receive_message");
  }, []);

  const sendMessage = async () => {
    if (currentMessage !== "" && userId) {
      const messageData = {
        user_id: userId,
        author: username,
        message: currentMessage,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      await socket.emit("send_message", messageData);
      setCurrentMessage("");
    } else if (!userId) {
      alert("You need to login to chat!");
    }
  };

  return (
    <div
      style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1000 }}
    >
      <button
        className="btn btn-primary rounded-circle p-3 shadow"
        onClick={() => setIsOpen(!isOpen)}
      >
        Chat
      </button>

      {isOpen && (
        <div
          className="card shadow mt-2"
          style={{ width: "300px", height: "400px" }}
        >
          <div className="card-header bg-primary text-white d-flex justify-content-between">
            <strong>Chat Community</strong>
            <button
              className="btn-close btn-close-white"
              onClick={() => setIsOpen(false)}
            ></button>
          </div>

          <div
            className="card-body overflow-auto"
            style={{ height: "280px", backgroundColor: "#f8f9fa" }}
          >
            {messageList.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.author === username ? "text-end" : "text-start"
                }`}
              >
                <small
                  className="text-muted fw-bold"
                  style={{
                    fontSize: "11px",
                    display: "block",
                    marginBottom: "2px",
                  }}
                >
                  {msg.author}
                </small>

                <div
                  className={`p-2 rounded ${
                    msg.author === username
                      ? "bg-primary text-white"
                      : "bg-white border"
                  }`}
                  style={{
                    display: "inline-block",
                    maxWidth: "80%",
                    wordWrap: "break-word",
                  }}
                >
                  {msg.message}
                </div>
                <small
                  className="text-muted d-block mt-1"
                  style={{ fontSize: "9px" }}
                >
                  {msg.time}
                </small>
              </div>
            ))}
          </div>

          <div className="card-footer d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Enter message..."
              value={currentMessage}
              onChange={(event) => setCurrentMessage(event.target.value)}
              onKeyPress={(event) => event.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-primary" onClick={sendMessage}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
