import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipient = (chat, user) => {
  const [userRecipient, setUserRecipient] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const recipientId = chat?.members.find(id => id !== user?.id);

  useEffect(() => {
    const getUser = async () => {
      setIsLoading(true);

      if (!recipientId) {
        setIsLoading(false);
        return null;
      }

      try {
        const response = await getRequest(`${baseUrl}user/${recipientId}`);
        if (response.error) {
          setError(response.error);
        } else {
          setUserRecipient(response);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setError("An error occurred while fetching user.");
      } finally {
        setIsLoading(false);
      }
    };

    getUser();
  }, [recipientId]);

  return { userRecipient, isLoading, error };
};
