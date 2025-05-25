'use client'

// import Link from 'next/link'
import { Menu, Transition } from '@headlessui/react'
import React from 'react'
import { FaBell, FaCheck } from 'react-icons/fa'

export interface Alert {
  id: number;
  acknowledged: boolean;
  event: {
    description: string;
    plateNumber: string;
  };
  eventId: number;
  status: string;
  time: string;
}

interface DropdownNotificationsProps {
  align?: 'left' | 'right';
  notifications: Alert[];
  unreadCount: number;
  onNotificationClick: (alertId: number) => void;
  onDropdownOpen: () => void;
}

export default function DropdownNotifications({ align, notifications, unreadCount, onNotificationClick, onDropdownOpen }: DropdownNotificationsProps) {
  const menuOpenRef = React.useRef(false);
  React.useEffect(() => {
    if (menuOpenRef.current) {
      onDropdownOpen();
    }
  }, [menuOpenRef.current]);
  return (
    <Menu as="div" className="relative inline-flex">
      {({ open }) => {
        menuOpenRef.current = open;
        return (
          <>
            <Menu.Button
              className={`w-8 h-8 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80 rounded-full ${open && 'bg-slate-200'}`}
            >
              <span className="sr-only">Alerts</span>
              <span className="relative">
                <FaBell className="w-5 h-5 text-slate-500 dark:text-slate-200" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-600 border-2 border-white dark:border-[#182235] rounded-full animate-pulse"></span>
                )}
              </span>
            </Menu.Button>
            <Transition
              as={React.Fragment}
              show={open}
              enter="transition ease-out duration-200 transform"
              enterFrom="opacity-0 -translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-out duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className={`origin-top-right z-10 absolute top-full -mr-48 sm:mr-0 min-w-[20rem] bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 py-1.5 rounded shadow-lg overflow-hidden mt-1 ${align === 'right' ? 'right-0' : 'left-0'}`}>
                <div className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase pt-1.5 pb-2 px-4">Alerts</div>
                <Menu.Items as="ul" className="focus:outline-none max-h-80 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <li className="py-2 px-4 text-slate-400 dark:text-slate-500">No alerts</li>
                  ) : (
                    notifications.map((a) => (
                      <Menu.Item as="li" key={a.id} className="border-b border-slate-200 dark:border-slate-700 last:border-0">
                        {({ active }) => (
                          <div className={`flex items-center justify-between gap-2 py-2 px-4 ${active ? 'bg-slate-50 dark:bg-slate-700/20' : ''} ${a.acknowledged ? 'opacity-60' : ''}`}>
                            <div className="flex-1 min-w-0">
                              <span className="block text-sm mb-1 font-medium text-slate-800 dark:text-slate-100">{a.event?.description || 'Alert'}</span>
                              <span className="block text-xs text-slate-500 dark:text-slate-400 mb-1">Plate: {a.event?.plateNumber || '-'}</span>
                              <span className="block text-xs font-medium text-slate-400 dark:text-slate-500">{new Date(a.time).toLocaleString()}</span>
                            </div>
                            {!a.acknowledged && (
                              <button
                                className="ml-2 p-1 rounded bg-green-600 hover:bg-green-500 text-white flex items-center justify-center"
                                title="Acknowledge Alert"
                                onClick={() => onNotificationClick(a.id)}
                              >
                                <FaCheck className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        )}
                      </Menu.Item>
                    ))
                  )}
                </Menu.Items>
              </div>
            </Transition>
          </>
        );
      }}
    </Menu>
  );
}
