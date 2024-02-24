import { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { AuthContext } from "../../Context/AuthContext";

const PotentialChat = () => {
  const { user } = useContext(AuthContext);
  const { potentialChat, createChat, onlineUsers } = useContext(ChatContext);

  return (
    <>
      <div className="all-users">
        {potentialChat &&
          potentialChat.map((u, ind) => {
            return (
              <div
                className="single-user"
                key={ind}
                onClick={() => createChat(user.id, u._id)}
              >
                {u.name}
                <span
                  className={
                    onlineUsers?.some(user => user?.userId === u?._id)
                      ? "user-online"
                      : ""
                  }
                ></span>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default PotentialChat;
