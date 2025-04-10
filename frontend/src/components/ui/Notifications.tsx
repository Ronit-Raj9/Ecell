'use client';

import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { removeNotification } from '@/redux/slices/uiSlice';

const NotificationItem = ({ id, message, type, timeout = 5000 }: { 
  id: string; 
  message: string; 
  type: 'success' | 'error' | 'info' | 'warning';
  timeout?: number;
}) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(id));
    }, timeout);

    return () => clearTimeout(timer);
  }, [id, timeout, dispatch]);

  // Get background color based on notification type
  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'info':
      default:
        return 'bg-blue-500';
    }
  };

  return (
    <div className={`${getBgColor()} text-white p-4 rounded shadow-lg my-2 max-w-md mx-auto flex justify-between items-center`}>
      <p>{message}</p>
      <button 
        onClick={() => dispatch(removeNotification(id))}
        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
      >
        ×
      </button>
    </div>
  );
};

const Notifications = () => {
  const { notifications } = useAppSelector(state => state.ui);

  if (!notifications.length) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col items-end">
      {notifications.map(notification => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </div>
  );
};

export default Notifications; 