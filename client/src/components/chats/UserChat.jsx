import { Stack } from "react-bootstrap";
import { useFetchRecipient } from "../../hooks/useFetchRecipient";
import avatar from "../../assets/avatar.svg";
import { useContext } from "react";
import { ChatContext } from "../../Context/ChatContext";
import { unReadNotificationFun } from "../../utils/unReadNotification.js";
import { useFetchLatestMessage } from "../../hooks/useFetchLatestMessage.js";
import moment from "moment";

const UserChat = ({ chat, user }) => {
  const { userRecipient } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationAsRead } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotifications = unReadNotificationFun(notifications);
  const thisUser = unreadNotifications?.filter(
    n => n.senderId === userRecipient?._id
  );
  let isOnline = onlineUsers?.some(user => user?.userId === userRecipient?._id);

  const truncateText = text => {
    let shortText = text.substring(0, 20);
    if (text.length > 20) {
      shortText = shortText + "...";
    }
    return shortText;
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={() => {
        if (thisUser?.length !== 0) {
          markThisUserNotificationAsRead(thisUser, notifications);
        }
      }}
    >
      {userRecipient === null ? (
        "Loading..."
      ) : (
        <>
          <div className="d-flex">
            <div className="me-2">
              <img src={avatar} height="35px" />
            </div>
            <div className="text-content">
              <div className="name">{userRecipient?.name}</div>
              <div className="text">
                {latestMessage?.text && (
                  <span>{truncateText(latestMessage?.text)}</span>
                )}
              </div>
            </div>
          </div>
          <div className="d-flex flex-column align-items-end">
            <div className="date">
              {moment(latestMessage?.createdAt).calendar()}
            </div>
            <div
              className={thisUser?.length > 0 ? "this-user-notifications" : ""}
            >
              {thisUser?.length > 0 ? thisUser?.length : ""}
            </div>
            <span className={isOnline ? "user-online" : ""}></span>
          </div>
        </>
      )}
    </Stack>
  );
};

export default UserChat;
