"use client"

import { useState } from 'react';
import { CheckCircle, Bell, AlertCircle } from 'lucide-react';
import { COLORS } from '../constants/colors';
import { formatDate } from '../utils/date';

const Notifications = ({ student, onUpdate }) => {
  const [notifications, setNotifications] = useState(student.notifications || []);
  const [filter, setFilter] = useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const handleMarkAsRead = (id) => {
    const updated = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    onUpdate({ ...student, notifications: updated });
  };

  const handleMarkAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    onUpdate({ ...student, notifications: updated });
  };

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5" style={{ color: COLORS.success }} />;
      case 'warning': return <AlertCircle className="w-5 h-5" style={{ color: COLORS.warning }} />;
      case 'error': return <AlertCircle className="w-5 h-5" style={{ color: COLORS.danger }} />;
      default: return <Bell className="w-5 h-5" style={{ color: COLORS.info }} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="space-y-6">
      <div className="rounded-lg p-6 shadow-sm" style={{ backgroundColor: COLORS.bgWhite }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold" style={{ color: COLORS.primary }}>
              Notifications
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'all' ? 'text-white' : 'hover:bg-gray-100'
                }`}
                style={{ backgroundColor: filter === 'all' ? COLORS.primary : 'transparent', color: filter === 'all' ? 'white' : COLORS.text }}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'unread' ? 'text-white' : 'hover:bg-gray-100'
                }`}
                style={{ backgroundColor: filter === 'unread' ? COLORS.primary : 'transparent', color: filter === 'unread' ? 'white' : COLORS.text }}
              >
                Unread ({unreadCount})
              </button>
              <button
                onClick={() => setFilter('read')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  filter === 'read' ? 'text-white' : 'hover:bg-gray-100'
                }`}
                style={{ backgroundColor: filter === 'read' ? COLORS.primary : 'transparent', color: filter === 'read' ? 'white' : COLORS.text }}
              >
                Read
              </button>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 border"
                style={{ color: COLORS.text, borderColor: COLORS.border }}
              >
                Mark all as read
              </button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg border transition-colors ${
                  !notification.read ? 'bg-blue-50' : 'bg-white'
                }`}
                style={{ borderColor: COLORS.border }}
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${
                    notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' :
                    notification.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold mb-1" style={{ color: COLORS.primary }}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-400">{formatDate(notification.date)}</p>
                      </div>
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="px-3 py-1 rounded-lg text-xs font-medium hover:bg-gray-100"
                          style={{ color: COLORS.info }}
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 mx-auto mb-4" style={{ color: COLORS.border }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: COLORS.primary }}>
                No notifications
              </h3>
              <p className="text-gray-600">
                {filter === 'unread' ? 'You have no unread notifications' : 
                 filter === 'read' ? 'You have no read notifications' : 
                 'You have no notifications yet'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;