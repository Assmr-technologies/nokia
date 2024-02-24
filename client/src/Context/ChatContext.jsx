import { createContext, useCallback, useEffect, useState } from "react";
import { getRequest, postRequest, baseUrl } from "../utils/services";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);
  const [potentialChat, setPotentialChat] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  // initial socket
  useEffect(() => {
    const newSocket = io("https://chat-app-socket-alpha.vercel.app");
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  // add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?.id);
    socket.on("getOnlineUsers", res => {
      setOnlineUsers(res);
    });

    // if user is logged out
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  // send message
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members?.find(id => id !== user?.id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  // receive message and notifications
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", res => {
      if (currentChat?._id !== res.chatId) return;
      setMessages(prev => [...prev, res]);
    });

    socket.on("getNotification", res => {
      const isChatOpen = currentChat?.members.some(id => id === res.senderId);
      if (isChatOpen) {
        setNotifications(prev => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications(prev => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await getRequest(`${baseUrl}users`);
      if (response.error) {
        return console.log("Error fetching users", response);
      }
      const pChats = response.filter(u => {
        let isChatCreated = false;
        if (user?.id === u._id) return false;

        if (userChats) {
          isChatCreated = userChats?.some(chat => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
          return !isChatCreated;
        }
      });
      setPotentialChat(pChats);
      setAllUsers(response);
    };
    getUsers();
  }, [userChats]);

  useEffect(() => {
    const getUserChats = async () => {
      if (user) {
        setIsChatLoading(true);
        setUserChatError(null);
        const response = await getRequest(`${baseUrl}chats/${user?.id}`);
        setIsChatLoading(false);
        if (response.error) {
          return setUserChatError(response);
        }
        setUserChats(response);
      }
    };
    getUserChats();
  }, [user, notifications]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      const response = await getRequest(
        `${baseUrl}messages/find/${currentChat?._id}`
      );
      setIsMessagesLoading(false);
      if (response.error) {
        return setMessagesError(response);
      }
      setMessages(response);
    };
    getMessages();
  }, [currentChat]);

  const updateCurrentChat = chat => {
    setCurrentChat(chat);
  };

  const createChat = useCallback(async (firstId, secondId) => {
    const response = await postRequest(
      `${baseUrl}chats`,
      JSON.stringify({ firstId, secondId })
    );
    if (response.error) {
      return console.log("Error creating chat", response);
    }
    setUserChats(prev => [...prev, response]);
  }, []);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) return toast.warn("Please enter a message");

      const response = await postRequest(
        `${baseUrl}messages`,
        JSON.stringify({
          chatId: currentChatId,
          senderId: sender.id,
          text: textMessage,
        })
      );
      if (response.error) {
        return setSendTextMessageError(response);
      }
      setNewMessage(response);
      setMessages(prev => [...prev, response]);
      setTextMessage("");
    },
    []
  );

  const markAllNotificationAsRead = useCallback(notification => {
    const modNotification = notification.map(n => {
      return { ...n, isRead: true };
    });
    setNotifications(modNotification);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      // find chat to open
      const desiredChat = userChats.find(chat => {
        const chatMembers = [user.id, n.senderId];
        const isDesiredChat = chat?.members.every(member => {
          return chatMembers.includes(member);
        });
        return isDesiredChat;
      });
      // mark now notification as read
      const mNotification = notifications.map(no => {
        if (n.senderId === no.senderId) {
          return { ...n, isRead: true };
        } else {
          return no;
        }
      });
      updateCurrentChat(desiredChat);
      setNotifications(mNotification);
    },
    []
  );

  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotification, notifications) => {
      // mark notification as read
      const mNotification = notifications.map(el => {
        let notification;
        thisUserNotification.forEach(n => {
          if (n.senderId === el.senderId) {
            notification = { ...n, isRead: true };
          } else {
            notification = el;
          }
        });
        return notification;
      });
      setNotifications(mNotification);
    },
    []
  );

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isChatLoading,
        userChatError,
        potentialChat,
        createChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
