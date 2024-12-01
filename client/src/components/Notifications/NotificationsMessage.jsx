import React, { useEffect, useState } from "react";

interface NotificationProps {
  message: string;
}

const Notification: React.FC<NotificationProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-green-500 text-white px-4 py-2 rounded shadow-lg">
      <span>{message}</span>
    </div>
  );
};

export default Notification;
