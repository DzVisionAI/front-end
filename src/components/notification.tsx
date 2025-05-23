'use client'
import { ReactElement } from 'react'
import { useEffect, useState } from 'react';
import { useNotificationStore } from '../app/lib/store';

interface NotificationProps {
  children: React.ReactNode
  className?: string
  type?: 'warning' | 'error' | 'success' | 'info' | ''
  open: boolean
  setOpen: (open: boolean) => void
  id: string
  onClose: (id: string) => void
}

export default function Notification({
  children,
  className = '',
  type = '',
  open,
  setOpen,
  id,
  onClose
}: NotificationProps) {

  const typeIcon = (type: string): ReactElement => {
    switch (type) {
      case 'warning':
        return (
          <svg className="w-4 h-4 shrink-0 fill-current text-amber-500 mt-[3px] mr-3" viewBox="0 0 16 16">
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm0 12c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1zm1-3H7V4h2v5z" />
          </svg>
        )
      case 'error':
        return (
          <svg className="w-4 h-4 shrink-0 fill-current text-rose-500 mt-[3px] mr-3" viewBox="0 0 16 16">
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm3.5 10.1l-1.4 1.4L8 9.4l-2.1 2.1-1.4-1.4L6.6 8 4.5 5.9l1.4-1.4L8 6.6l2.1-2.1 1.4 1.4L9.4 8l2.1 2.1z" />
          </svg>
        )
      case 'success':
        return (
          <svg className="w-4 h-4 shrink-0 fill-current text-emerald-500 mt-[3px] mr-3" viewBox="0 0 16 16">
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zM7 11.4L3.6 8 5 6.6l2 2 4-4L12.4 6 7 11.4z" />
          </svg>
        )
      default:
        return (
          <svg className="w-4 h-4 shrink-0 fill-current text-indigo-500 mt-[3px] mr-3" viewBox="0 0 16 16">
            <path d="M8 0C3.6 0 0 3.6 0 8s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm1 12H7V7h2v5zM8 6c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z" />
          </svg>
        )
    }
  }

  return (
    <>
      {open &&
        <div className={className} role="alert">
          <div className="inline-flex flex-col w-full max-w-lg px-4 py-4 rounded-sm text-sm bg-white dark:bg-slate-800 shadow-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
            <div className="flex w-full justify-between items-start">
              <div className="flex">
                {typeIcon(type)}
                <div>
                  {children}
                </div>
              </div>
              <button className="opacity-70 hover:opacity-80 ml-3 mt-[3px]" onClick={() => {
                setOpen(false);
                setTimeout(() => onClose(id), 300);
              }}>
                <div className="sr-only">Close</div>
                <svg className="w-4 h-4 fill-current">
                  <path d="M7.95 6.536l4.242-4.243a1 1 0 111.415 1.414L9.364 7.95l4.243 4.242a1 1 0 11-1.415 1.415L7.95 9.364l-4.243 4.243a1 1 0 01-1.414-1.415L6.536 7.95 2.293 3.707a1 1 0 011.414-1.414L7.95 6.536z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      }
    </>
  )
}

export function NotificationStack() {
  const { notifications, removeNotification } = useNotificationStore();
  const [openMap, setOpenMap] = useState<{ [id: string]: boolean }>({});

  useEffect(() => {
    // Open all new notifications
    setOpenMap((prev) => {
      const next = { ...prev };
      notifications.forEach((n) => {
        if (!(n.id in next)) next[n.id] = true;
      });
      return next;
    });
  }, [notifications]);

  useEffect(() => {
    // Auto-dismiss after 3s
    notifications.forEach((n) => {
      if (openMap[n.id]) {
        const timer = setTimeout(() => {
          setOpenMap((prev) => ({ ...prev, [n.id]: false }));
          setTimeout(() => removeNotification(n.id), 300); // Remove after fade
        }, 3000);
        return () => clearTimeout(timer);
      }
    });
  }, [notifications, openMap, removeNotification]);

  if (notifications.length === 0) return null;
  return (
    <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2 items-end">
      {notifications.map((n) => (
        <Notification
          key={n.id}
          type={n.type}
          open={openMap[n.id]}
          setOpen={(open) => {
            setOpenMap((prev) => ({ ...prev, [n.id]: open }));
            if (!open) setTimeout(() => removeNotification(n.id), 300);
          }}
          id={n.id}
          onClose={removeNotification}
        >
          {n.message}
        </Notification>
      ))}
    </div>
  );
}