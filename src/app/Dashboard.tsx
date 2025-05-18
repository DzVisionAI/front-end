'use client'

import React, { useState, useRef, useEffect } from 'react';
import Logo from './ui/logo';
import Footer from './ui/footer';
import { FaUser, FaUsers, FaBan, FaEdit, FaTrash, FaSignOutAlt, FaChevronDown, FaUserEdit, FaVideo, FaIdCard, FaCalendarAlt, FaClock, FaImage, FaKey } from 'react-icons/fa';
import { FaFileCsv } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { authService } from '@/app/services/auth';
import { useUserStore } from './lib/store';
import { userService } from './services/user';
import { tabService } from './services/tabService';

const tabs = [
    { name: 'Plate' },
    { name: 'Events' },
    { name: 'Vehicules' },
    { name: 'Drivers' },
    { name: 'Cameras' },
];

const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'fr', label: 'Français', flag: '🇫🇷' },
    { code: 'ar', label: 'العربية', flag: '🇩🇿' },
];

// Define Plate type
interface Plate {
    id: number;
    plateNumber: string;
    detectedAt: string;
    image: string;
    cameraId: number | null;
    vehicle: {
        id: number;
        image: string;
        color: string | null;
        make: string | null;
        model: string | null;
        ownerId: number | null;
        registerAt: string;
    };
}

interface Event {
    id: number;
    cameraId: number | null;
    description: string;
    driverId: number | null;
    plateId: number | null;
    time: string;
    typeName: string;
}

interface Vehicule {
    id: number;
    color: string | null;
    image: string;
    make: string | null;
    model: string | null;
    ownerId: number | null;
    plateNumber: string | null;
    registerAt: string;
}

// Helper to convert local file path to browser path
// function toPublicPlateImagePath(path: string | null | undefined): string | undefined {
//     if (!path) return undefined;
//     // If already a public path, return as is
//     if (path.startsWith('/uploads/plates/')) return path;
//     // Otherwise, extract after '/uploads/plates/'
//     const idx = path.indexOf('/uploads/plates/');
//     if (idx !== -1) {
//         return path.substring(idx);
//     }
//     return undefined;
// }

export default function Dashboard() {
    const [activeTab, setActiveTab] = useState('Plate');
    const [langOpen, setLangOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [selectedLang, setSelectedLang] = useState(languages[0]);
    const user = useUserStore(state => state.user);
    const setUser = useUserStore(state => state.setUser);
    const [profileModalOpen, setProfileModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
    const [passwordMsg, setPasswordMsg] = useState('');
    const [passwordErr, setPasswordErr] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [tabData, setTabData] = useState<Plate[] | unknown[]>([]);
    const [tabLoading, setTabLoading] = useState(false);
    const [tabError, setTabError] = useState('');

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

    // Helper type guard for error
    function isApiErrorWithMessage(err: unknown): err is { response: { data: { message: string } } } {
        return (
            typeof err === 'object' &&
            err !== null &&
            'response' in err &&
            typeof (err as { response?: unknown }).response === 'object' &&
            (err as { response?: unknown }).response !== null &&
            (err as { response?: unknown }).response !== undefined &&
            'data' in ((err as { response?: { data?: unknown } }).response ?? {}) &&
            typeof ((err as { response: { data?: unknown } }).response?.data) === 'object' &&
            ((err as { response: { data?: unknown } }).response?.data) !== null &&
            'message' in (((err as { response: { data: { message?: unknown } } }).response?.data) ?? {})
        );
    }

    useEffect(() => {
        let fetcher: (() => Promise<Plate[]>) | null = null;
        setTabError('');
        setTabLoading(true);
        if (activeTab === 'Plate') fetcher = tabService.getLicensePlates;
        else if (activeTab === 'Events') fetcher = tabService.getEvents as () => Promise<Plate[]>;
        else if (activeTab === 'Vehicules') fetcher = tabService.getVehicules as () => Promise<Plate[]>;
        else if (activeTab === 'Drivers') fetcher = tabService.getDrivers as () => Promise<Plate[]>;
        else if (activeTab === 'Cameras') fetcher = tabService.getCameras as () => Promise<Plate[]>;
        if (fetcher) {
            fetcher()
                .then(data => setTabData(Array.isArray(data) ? data : []))
                .catch(() => setTabError('Failed to load data.'))
                .finally(() => setTabLoading(false));
        } else {
            setTabData([]);
            setTabLoading(false);
        }
    }, [activeTab]);

    // Logout function using authService
    const handleLogout = async () => {
        await authService.logout();
        router.push('/');
    };

    // Password reset handler
    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMsg(''); setPasswordErr(''); setPasswordLoading(true);
        if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
            setPasswordErr('Passwords do not match.');
            setPasswordLoading(false);
            return;
        }
        try {
            const ok = await userService.resetMyPassword({ oldPassword: passwordForm.oldPassword, newPassword: passwordForm.newPassword });
            if (ok === true) {
                setPasswordMsg('Password reset successfully.');
                setPasswordForm({ oldPassword: '', newPassword: '', confirmNewPassword: '' });
            } else if (ok && typeof ok === 'object' && ok.message) {
                setPasswordErr(ok.message);
            } else {
                setPasswordErr('Failed to reset password.');
            }
        } catch (err: unknown) {
            if (isApiErrorWithMessage(err)) {
                setPasswordErr(err.response.data.message);
            } else {
                setPasswordErr('Failed to reset password.');
            }
        } finally {
            setPasswordLoading(false);
        }
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
                                <button
                                    className="flex items-center w-full px-4 py-2 hover:bg-gray-700"
                                    onClick={() => { setSettingsOpen(false); setProfileModalOpen(true); }}
                                >
                                    <FaKey className="mr-2" />Reset Password
                                </button>
                            </div>
                        )}
                    </div>
                    {/* Logout Button */}
                    <button className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-500 rounded focus:outline-none" onClick={handleLogout}>
                        <FaSignOutAlt className="mr-2" />Logout
                    </button>
                </div>
            </header>

            {/* Password Reset Modal */}
            {profileModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-gray-800 rounded-lg shadow-lg w-full max-w-md p-6 relative">
                        <button className="absolute top-2 right-2 text-gray-400 hover:text-gray-200" onClick={() => { setProfileModalOpen(false); setPasswordMsg(''); setPasswordErr(''); }}>&times;</button>
                        <h2 className="text-xl font-bold text-indigo-300 mb-4 text-center">Reset Password</h2>
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            <div>
                                <label className="block text-gray-200 text-sm mb-1">Current Password</label>
                                <input type="password" className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none" value={passwordForm.oldPassword} onChange={e => setPasswordForm({ ...passwordForm, oldPassword: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-200 text-sm mb-1">New Password</label>
                                <input type="password" className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none" value={passwordForm.newPassword} onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} required />
                            </div>
                            <div>
                                <label className="block text-gray-200 text-sm mb-1">Confirm New Password</label>
                                <input type="password" className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none" value={passwordForm.confirmNewPassword} onChange={e => setPasswordForm({ ...passwordForm, confirmNewPassword: e.target.value })} required />
                            </div>
                            {passwordMsg && <div className="text-green-400 text-sm">{passwordMsg}</div>}
                            {passwordErr && <div className="text-red-400 text-sm">{passwordErr}</div>}
                            <button type="submit" className="w-full py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow transition" disabled={passwordLoading}>{passwordLoading ? 'Saving...' : 'Reset Password'}</button>
                        </form>
                    </div>
                </div>
            )}

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
                    {tabLoading ? (
                        <div className="text-center text-gray-400 py-8">Loading...</div>
                    ) : tabError ? (
                        <div className="text-center text-red-400 py-8">{tabError}</div>
                    ) : activeTab === 'Plate' ? (
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
                                            <th className="px-3 py-2 text-center">ACTIONS</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tabData.length === 0 ? (
                                            <tr><td colSpan={8} className="text-center text-gray-400 py-4">No data found.</td></tr>
                                        ) : (
                                            (tabData as Plate[]).map((row, idx) => {
                                                const plate = row as Plate;
                                                return (
                                                    <tr key={plate.id || idx} className="border-b border-gray-700 even:bg-gray-700/40 hover:bg-gray-700/60 transition">
                                                        <td className="px-3 py-2 align-middle font-semibold text-gray-100">{plate.plateNumber || '-'}</td>
                                                        <td className="px-3 py-2 align-middle">
                                                            {(plate.vehicle?.image) ? (
                                                                <img src={plate.vehicle?.image} alt="Vehicle" className="w-16 h-8 object-cover rounded mx-auto" />
                                                            ) : (
                                                                <div className="w-16 h-8 bg-gray-600 rounded mx-auto flex items-center justify-center"><FaImage className="text-gray-400" /></div>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2 align-middle">
                                                            {(plate.image) ? (
                                                                <img src={(plate.image)} alt="Plate" className="w-12 h-6 object-cover rounded mx-auto" />
                                                            ) : (
                                                                <div className="w-12 h-6 bg-gray-600 rounded mx-auto flex items-center justify-center"><FaImage className="text-gray-400" /></div>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2 align-middle">{plate.detectedAt ? new Date(plate.detectedAt).toLocaleDateString() : '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{plate.detectedAt ? new Date(plate.detectedAt).toLocaleTimeString() : '-'}</td>
                                                        <td className="px-3 py-2 align-middle">-</td>
                                                        <td className="px-3 py-2 align-middle">{plate.cameraId ?? '-'}</td>
                                                        <td className="px-3 py-2 align-middle flex space-x-2 justify-center">
                                                            <button className="text-blue-400 hover:text-blue-200 p-1" title="Edit"><FaUserEdit /></button>
                                                            <button className="text-red-400 hover:text-red-200 p-1" title="Delete"><FaTrash /></button>
                                                        </td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'Events' ? (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-300">
                                            <th className="px-3 py-2 text-left">ID</th>
                                            <th className="px-3 py-2 text-left">Camera ID</th>
                                            <th className="px-3 py-2 text-left">Description</th>
                                            <th className="px-3 py-2 text-left">Driver ID</th>
                                            <th className="px-3 py-2 text-left">Plate ID</th>
                                            <th className="px-3 py-2 text-left">Time</th>
                                            <th className="px-3 py-2 text-left">Type</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tabData.length === 0 ? (
                                            <tr><td colSpan={7} className="text-center text-gray-400 py-4">No data found.</td></tr>
                                        ) : (
                                            (tabData as Event[]).map((row, idx) => {
                                                const event = row as Event;
                                                return (
                                                    <tr key={event.id || idx} className="border-b border-gray-700 even:bg-gray-700/40 hover:bg-gray-700/60 transition">
                                                        <td className="px-3 py-2 align-middle">{event.id}</td>
                                                        <td className="px-3 py-2 align-middle">{event.cameraId ?? '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{event.description || '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{event.driverId ?? '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{event.plateId ?? '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{event.time ? new Date(event.time).toLocaleString() : '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{event.typeName || '-'}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : activeTab === 'Vehicules' ? (
                        <div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm rounded-lg overflow-hidden bg-gray-800 border border-gray-700">
                                    <thead>
                                        <tr className="bg-gray-700 text-gray-300">
                                            <th className="px-3 py-2 text-left">ID</th>
                                            <th className="px-3 py-2 text-left">Image</th>
                                            <th className="px-3 py-2 text-left">Color</th>
                                            <th className="px-3 py-2 text-left">Make</th>
                                            <th className="px-3 py-2 text-left">Model</th>
                                            <th className="px-3 py-2 text-left">Owner ID</th>
                                            <th className="px-3 py-2 text-left">Plate Number</th>
                                            <th className="px-3 py-2 text-left">Register At</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {tabData.length === 0 ? (
                                            <tr><td colSpan={8} className="text-center text-gray-400 py-4">No data found.</td></tr>
                                        ) : (
                                            (tabData as Vehicule[]).map((row, idx) => {
                                                const vehicule = row as Vehicule;
                                                return (
                                                    <tr key={vehicule.id || idx} className="border-b border-gray-700 even:bg-gray-700/40 hover:bg-gray-700/60 transition">
                                                        <td className="px-3 py-2 align-middle">{vehicule.id}</td>
                                                        <td className="px-3 py-2 align-middle">
                                                            {vehicule.image ? (
                                                                <img src={vehicule.image} alt="Vehicle" className="w-16 h-8 object-cover rounded mx-auto" />
                                                            ) : (
                                                                <div className="w-16 h-8 bg-gray-600 rounded mx-auto flex items-center justify-center"><FaImage className="text-gray-400" /></div>
                                                            )}
                                                        </td>
                                                        <td className="px-3 py-2 align-middle">{vehicule.color || '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{vehicule.make || '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{vehicule.model || '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{vehicule.ownerId ?? '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{vehicule.plateNumber || '-'}</td>
                                                        <td className="px-3 py-2 align-middle">{vehicule.registerAt ? new Date(vehicule.registerAt).toLocaleDateString() : '-'}</td>
                                                    </tr>
                                                );
                                            })
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="text-gray-400 text-center py-8">{activeTab} content coming soon...</div>
                    )}
                </section>
            </main>
            <Footer />
        </div>
    );
} 