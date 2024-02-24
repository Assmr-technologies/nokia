export const unReadNotificationFun = notifications => {
  return notifications.filter(n => n.isRead === false);
};
