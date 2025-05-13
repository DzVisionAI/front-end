'use client'

import React, { useState, useRef, useEffect } from 'react';
import Logo from './ui/logo';
import Footer from './ui/footer';
import { FaUser, FaUsers, FaBan, FaCog, FaEdit, FaTrash, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth';

const tabs = [
    { name: 'Plate' },
    { name: 'Report' },
    { name: 'Alert' },
    { name: 'Driver' },
];

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
];

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Plate');
    const [langOpen, setLangOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(languages[0]);

    const langRef = useRef<HTMLDivElement>(null);
    const settingsRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (langRef.current && !langRef.current.contains(event.target as Node)) {
                setLangOpen(false);
            }
            if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
                setSettingsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Logout function using authService
    const handleLogout = async () => {
        await authService.logout();
        router.push('/');
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-gray-200 font-inter">
            {/* Header */}
            <header className="w-full bg-gray-800 shadow flex items-center justify-between px-6 py-4">
                <div className="flex items-center">
                    <Logo />
                    <span className="ml-3 text-xl font-bold tracking-tight text-indigo-400 hidden sm:inline">Dashboard</span>
                </div>
                <div className="flex items-center space-x-4">
                    {/* Language Selector */}
                    <div className="relative" ref={langRef}>
                        <button
                            className="flex items-center px-3 py-2 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                            onClick={() => setLangOpen((open) => !open)}
                        >
                            <span className="mr-1">{selectedLang.flag}</span>
                            <FaChevronDown className="text-xs" />
                        </button>
                        {langOpen && (
                            <div className="absolute right-0 mt-2 w-36 bg-gray-800 border border-gray-700 rounded shadow-lg z-20">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.code}
                                        className={`flex items-center w-full px-4 py-2 hover:bg-gray-700 ${selectedLang.code === lang.code ? 'text-indigo-400' : ''}`}
                                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                                    >
                                        <span className="mr-2">{lang.flag}</span> {lang.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Settings Dropdown */}
                    <div className="relative group" ref={settingsRef}>
                        <button className="flex items-center px-4 py-2 bg-gray-700 rounded hover:bg-gray-600 focus:outline-none" onClick={() => setSettingsOpen((open) => !open)}>
                            <FaUser className="mr-2 text-lg" />
                            <FaChevronDown className="text-xs" />
                        </button>
                        {settingsOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded shadow-lg z-20">
                                <button
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                    onClick={() => { setSettingsOpen(false); router.push('/users'); }}
                                >
                                    <FaUsers className="mr-2" />User Management
                                </button>
                                <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-700"><FaBan className="mr-2" />Blacklist</a>
                                <a href="#" className="flex items-center px-4 py-2 hover:bg-gray-700"><FaCog className="mr-2" />Preferences</a>
                            </div>
                        )}
                    </div>
                    {/* Logout Button */}
                    <button className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 rounded focus:outline-none" onClick={handleLogout}>
                        <FaSignOutAlt className="mr-2" />Logout
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-6 space-y-6">
                {/* Camera Section */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Uploads */}
                    <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center justify-center min-h-[180px] shadow-lg">
                        <span className="mb-2 font-semibold text-indigo-300">Upload Camera Image</span>
                        <input type="file" accept="image/*" className="mb-2" />
                        <span className="mb-2 font-semibold text-indigo-300">Upload Camera Video</span>
                        <input type="file" accept="video/*" />
                    </div>
                    {/* Current Event */}
                    <div className="bg-gray-800 rounded-lg p-4 flex flex-col items-center min-h-[180px] shadow-lg">
                        <div className="mb-4 w-full flex flex-col items-center">
                            <div className="w-40 h-24 bg-gray-700 rounded mb-2 flex items-center justify-center text-gray-400">Car Image</div>
                            <div className="flex flex-col w-full items-center">
                                <div className="flex justify-between w-full mb-1">
                                    <span className="text-xs text-gray-400">PLATE NUMBER</span>
                                    <span className="text-xs text-gray-400">PLATE IMAGE</span>
                                </div>
                                <div className="flex justify-between w-full">
                                    <span className="font-bold">146تونس8440</span>
                                    <div className="w-20 h-8 bg-gray-700 rounded flex items-center justify-center text-gray-400">Plate Img</div>
                                </div>
                            </div>
                        </div>
                        <button className="mt-2 px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 text-sm flex items-center"><FaEdit className="mr-1" />Edit</button>
                    </div>
                    {/* Placeholder for third column (map skipped) */}
                    <div></div>
                </section>

                {/* Tabs Section */}
                <section className="bg-gray-800 rounded-lg p-4 shadow-lg">
                    {/* Tabs */}
                    <div className="flex space-x-2 border-b border-gray-700 mb-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.name}
                                className={`px-5 py-2 font-semibold rounded-t transition-colors duration-200 focus:outline-none ${activeTab === tab.name ? 'bg-indigo-600 text-white shadow' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}
                                onClick={() => setActiveTab(tab.name)}
                            >
                                {tab.name}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'Plate' && (
                        <div>
                            <div className="flex justify-end space-x-2 mb-2">
                                <button className="px-3 py-1 bg-green-600 rounded hover:bg-green-500 text-sm flex items-center"><FaEdit className="mr-1" />Generate PDF</button>
                                <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 text-sm flex items-center"><FaEdit className="mr-1" />Download CSV</button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm rounded-lg overflow-hidden">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-300">
                                            <th className="px-3 py-2">PLATE NUMBER</th>
                                            <th className="px-3 py-2">CAR IMAGE</th>
                                            <th className="px-3 py-2">PLATE IMAGE</th>
                                            <th className="px-3 py-2">DATE</th>
                                            <th className="px-3 py-2">TIME</th>
                                            <th className="px-3 py-2">CAMERA NAME</th>
                                            <th className="px-3 py-2">POSITION</th>
                                            <th className="px-3 py-2">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Placeholder rows */}
                                        <tr className="border-b border-gray-700">
                                            <td className="px-3 py-2">146تونس8440</td>
                                            <td className="px-3 py-2"><div className="w-16 h-8 bg-gray-600 rounded"></div></td>
                                            <td className="px-3 py-2"><div className="w-12 h-6 bg-gray-600 rounded"></div></td>
                                            <td className="px-3 py-2">10/06/2021</td>
                                            <td className="px-3 py-2">12:19:50</td>
                                            <td className="px-3 py-2">Cam0</td>
                                            <td className="px-3 py-2">In</td>
                                            <td className="px-3 py-2 flex space-x-2">
                                                <button className="text-blue-400 hover:underline text-xs flex items-center"><FaEdit className="mr-1" />Edit</button>
                                                <button className="text-red-400 hover:underline text-xs flex items-center"><FaTrash className="mr-1" />Delete</button>
                                            </td>
                                        </tr>
                                        {/* Add more placeholder rows as needed */}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    {/* Other tabs placeholder */}
                    {activeTab !== 'Plate' && (
                        <div className="text-gray-400 text-center py-8">{activeTab} content coming soon...</div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
} 