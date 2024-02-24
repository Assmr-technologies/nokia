import { Suspense, lazy, useContext, useEffect, useState } from "react";
import { ChatContext } from "../Context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../components/chats/UserChat";
import { AuthContext } from "../Context/AuthContext";
import PotentialChat from "../components/chats/PotentialChat";
const ChatBox = lazy(() => import("../components/chats/ChatBox"));

const Chat = () => {
  const { user } = useContext(AuthContext);

  const { userChats, isChatLoading, updateCurrentChat } =
    useContext(ChatContext);

  const [selectedChat, setSelectedChat] = useState(null);
  useEffect(() => {
    if (selectedChat) {
      updateCurrentChat(selectedChat);
    }
  }, [selectedChat, updateCurrentChat]);

  return (
    <Container>
      <PotentialChat />
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isChatLoading && <p>loading chats...</p>}
            {userChats?.map((chat, index) => {
              return (
                <div
                  key={index}
                  onClick={() => setSelectedChat(chat)}
                  style={{ borderRadius: "15px 10px 0 0", background: "#333" }}
                >
                  <UserChat chat={chat} user={user} />
                </div>
              );
            })}
          </Stack>
          <Suspense fallback={"Loading..."}>
            <ChatBox selectedChat={selectedChat} />
          </Suspense>
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
