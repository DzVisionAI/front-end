'use client'

import React, { useState, useRef, useEffect } from 'react';
import Logo from './ui/logo';
import Footer from './ui/footer';
import { FaUser, FaUsers, FaBan, FaCog, FaEdit, FaTrash, FaSignOutAlt, FaChevronDown, FaUserEdit, FaCar, FaVideo, FaIdCard, FaCalendarAlt, FaClock, FaImage } from 'react-icons/fa';
import { FaFileCsv } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth';
import { useUserStore } from './lib/store';

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
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);

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

    useEffect(() => {
        // Hydrate user from cookie if not already set
        if (!user) {
            const match = document.cookie.match(/(?:^|; )role=([^;]*)/);
            const role = match ? decodeURIComponent(match[1]) : null;
            // Optionally, you can also hydrate id/email/name from other cookies or a backend call
            if (role) {
                setUser({ id: 0, email: '', name: '', role });
            }
        }
    }, [user, setUser]);

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
                                {user?.role === 'admin' && (
                                    <>
                                        <button
                                            className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                            onClick={() => { setSettingsOpen(false); router.push('/users'); }}
                                        >
                                            <FaUsers className="mr-2" />User Management
                                        </button>
                                        <button
                                            className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                            onClick={() => { setSettingsOpen(false); router.push('/black-lists'); }}
                                        >
                                            <FaBan className="mr-2" />Blacklist
                                        </button>
                                    </>
                                )}
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
                {/* Camera Section - Redesigned */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Uploads - 2/3 width */}
                    <div className="md:col-span-2 bg-gray-800 rounded-lg p-6 flex flex-col items-center justify-center min-h-[220px] shadow-lg">
                        <span className="mb-4 font-semibold text-indigo-300 text-lg flex items-center gap-2">
                            <span> <FaEdit className="inline-block text-indigo-400 text-xl" /> </span>
                            Upload Camera Image/Video
                        </span>
                        <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
                            <label className="flex flex-col items-center w-full md:w-1/2 cursor-pointer bg-gray-700 hover:bg-gray-600 transition rounded-lg p-4 border-2 border-dashed border-indigo-500 text-gray-300">
                                <FaEdit className="text-2xl mb-2 text-indigo-400" />
                                <span className="mb-2 font-medium">Upload Image</span>
                                <input type="file" accept="image/*" className="hidden" />
                            </label>
                            <label className="flex flex-col items-center w-full md:w-1/2 cursor-pointer bg-gray-700 hover:bg-gray-600 transition rounded-lg p-4 border-2 border-dashed border-indigo-500 text-gray-300">
                                <FaEdit className="text-2xl mb-2 text-indigo-400" />
                                <span className="mb-2 font-medium">Upload Video</span>
                                <input type="file" accept="video/*" className="hidden" />
                            </label>
                        </div>
                        <div className="flex gap-3 mt-6">
                            <button className="flex items-center gap-2 px-5 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow transition">
                                <FaEdit className="text-lg" />
                                Process Upload
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2 rounded bg-gray-600 hover:bg-gray-500 text-gray-200 font-semibold shadow transition">
                                <FaTrash className="text-lg" />
                                Clear
                            </button>
                        </div>
                    </div>
                    {/* Current Event - 1/3 width */}
                    <div className="md:col-span-1 bg-gray-800 rounded-lg p-6 flex flex-col items-center min-h-[220px] shadow-lg">
                        <h3 className="text-lg font-bold text-indigo-300 mb-6 w-full text-center tracking-wide">Current Event</h3>
                        {/* Car Image */}
                        <div className="w-40 h-24 bg-gray-700 rounded-lg mb-6 flex items-center justify-center text-gray-400 shadow-inner border border-gray-600">
                            <FaEdit className="text-3xl" />
                            <span className="ml-2 text-base">Car Image</span>
                        </div>
                        {/* Plate Info Table */}
                        <div className="w-full">
                            <table className="min-w-full text-sm rounded-lg overflow-hidden bg-gray-700 border border-gray-600">
                                <thead>
                                    <tr>
                                        <th className="px-3 py-2 text-left text-gray-300 font-semibold border-b border-gray-600">Plate Image</th>
                                        <th className="px-3 py-2 text-left text-gray-300 font-semibold border-b border-gray-600">Plate Number</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-3 py-3">
                                            <div className="w-20 h-8 bg-gray-600 rounded flex items-center justify-center text-gray-400 border border-gray-500">
                                                <FaEdit className="text-lg" />
                                                <span className="ml-1 text-xs">Plate Img</span>
                                            </div>
                                        </td>
                                        <td className="px-3 py-3 font-bold text-gray-200 text-base">146تونس8440</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
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
                                <button className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500 text-sm flex items-center gap-2 font-semibold">
                                    <FaFileCsv className="text-lg" />
                                    Download CSV
                                </button>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-300">
                                            <th className="px-3 py-2 text-left"><span className="flex items-center gap-1"><FaIdCard />PLATE NUMBER</span></th>
                                            <th className="px-3 py-2 text-left"><span className="flex items-center gap-1"><FaImage />CAR IMAGE</span></th>
                                            <th className="px-3 py-2 text-left"><span className="flex items-center gap-1"><FaImage />PLATE IMAGE</span></th>
                                            <th className="px-3 py-2 text-left"><span className="flex items-center gap-1"><FaCalendarAlt />DATE</span></th>
                                            <th className="px-3 py-2 text-left"><span className="flex items-center gap-1"><FaClock />TIME</span></th>
                                            <th className="px-3 py-2 text-left">Driver</th>
                                            <th className="px-3 py-2 text-left"><span className="flex items-center gap-1"><FaVideo />CAMERAS</span></th>
                                            <th className="px-3 py-2 text-left"><span className="flex items-center gap-1"><FaCar />VEHICULES</span></th>
                                            <th className="px-3 py-2 text-center">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {/* Example row - align with headers */}
                                        <tr className="border-b border-gray-700 even:bg-gray-700/40 hover:bg-gray-700/60 transition">
                                            <td className="px-3 py-2 align-middle font-semibold text-gray-100">146تونس8440</td>
                                            <td className="px-3 py-2 align-middle"><div className="w-16 h-8 bg-gray-600 rounded mx-auto flex items-center justify-center"><FaImage className="text-gray-400" /></div></td>
                                            <td className="px-3 py-2 align-middle"><div className="w-12 h-6 bg-gray-600 rounded mx-auto flex items-center justify-center"><FaImage className="text-gray-400" /></div></td>
                                            <td className="px-3 py-2 align-middle">10/06/2021</td>
                                            <td className="px-3 py-2 align-middle">12:19:50</td>
                                            <td className="px-3 py-2 align-middle">John Doe</td>
                                            <td className="px-3 py-2 align-middle">Cam0</td>
                                            <td className="px-3 py-2 align-middle">SUV</td>
                                            <td className="px-3 py-2 align-middle flex space-x-2 justify-center">
                                                <button className="text-blue-400 hover:text-blue-200 p-1" title="Edit"><FaUserEdit /></button>
                                                <button className="text-red-400 hover:text-red-200 p-1" title="Delete"><FaTrash /></button>
                                            </td>
                                        </tr>
                                        {/* Add more rows as needed */}
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