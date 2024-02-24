import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../Context/AuthContext";
import { ChatContext } from "../../Context/ChatContext.jsx";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";

const ChatBox = ({ selectedChat }) => {
  const { user } = useContext(AuthContext);
  const { isMessagesLoading, messages, sendTextMessage } =
    useContext(ChatContext);
  const { userRecipient, isLoading } = useFetchRecipient(selectedChat, user);
  const [textMessage, setTextMessage] = useState("");
  const scroll = useRef();

  useEffect(() => {
    scroll.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isLoading) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Chat...</p>
    );
  }

  if (!userRecipient) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No conversation selected yet...
      </p>
    );
  }

  return (
    <Stack gap={4} className="chat-box">
      <div className="chat-header">
        <strong>{userRecipient?.name}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages &&
          messages.map((message, index) => (
            <Stack
              key={index}
              className={`${
                message?.senderId === user?.id
                  ? "message self align-self-end flex-grow-0"
                  : "message align-self-start flex-grow-0"
              }`}
              ref={scroll}
            >
              <span>{message.text}</span>
              <span className="message-footer">
                {moment(message.createdAt).calendar()}
              </span>
            </Stack>
          ))}
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2)"
          // onEnter={sendMessage}
        />
        <button
          className="send-btn"
          onClick={() =>
            sendTextMessage(textMessage, user, selectedChat._id, setTextMessage)
          }
        >
          <svg width="20" height="20" viewBox="0 0 15 15">
            <path
              fill="currentColor"
              d="M14.954.71a.5.5 0 0 1-.1.144L5.4 10.306l2.67 4.451a.5.5 0 0 0 .889-.06zM4.694 9.6L.243 6.928a.5.5 0 0 1 .06-.889L14.293.045a.5.5 0 0 0-.146.101z"
            />
          </svg>
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
