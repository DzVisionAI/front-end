'use client'

import React, { useState, useEffect, Fragment, useRef } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaPlus, FaSearch, FaUserEdit, FaTrash, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { blacklistService, BlacklistEntry, CreateBlacklistDto } from '../services/blacklist';

const statuses = ['All', 'Active', 'Inactive'];

// Helper to show notification
async function showNotification(type: 'success' | 'error' | 'info' | 'warning', message: string) {
    if (typeof window !== 'undefined') {
        const mod = await import('../lib/store');
        const { addNotification } = mod.useNotificationStore.getState();
        addNotification({ type, message });
    }
}

export default function BlacklistPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [blacklist, setBlacklist] = useState<BlacklistEntry[]>([]);
    const [loading, setLoading] = useState(false);
    const [editId, setEditId] = useState<number | null>(null);
    const router = useRouter();

    // Modal form state
    const [form, setForm] = useState<CreateBlacklistDto>({ plateNumber: '', reason: '', status: 'Active' });

    // Notification ref to avoid stale closure in async
    const notificationRef = useRef<typeof import('../lib/store') | null>(null);
    if (typeof window !== 'undefined' && !notificationRef.current) {
        notificationRef.current = require('../lib/store');
    }

    // Fetch blacklist entries
    useEffect(() => {
        const fetchBlacklist = async () => {
            setLoading(true);
            const data = await blacklistService.getBlacklists();
            setBlacklist(data);
            setLoading(false);
        };
        fetchBlacklist();
    }, []);

    // CRUD Handlers
    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const created = await blacklistService.createBlacklist(form);
        if (created) {
            setBlacklist(list => [created, ...list]);
            showNotification('success', 'Blacklist entry added successfully');
        } else {
            showNotification('error', 'Failed to add blacklist entry');
        }
        setModalOpen(false);
        setForm({ plateNumber: '', reason: '', status: 'Active' });
    };

    const handleDelete = async (id: number) => {
        if (await blacklistService.deleteBlacklist(id)) {
            setBlacklist(list => list.filter(entry => entry.id !== id));
            showNotification('success', 'Blacklist entry deleted successfully');
        } else {
            showNotification('error', 'Failed to delete blacklist entry');
        }
    };

    const openEditModal = (entry: BlacklistEntry) => {
        setEditId(entry.id);
        setForm({ plateNumber: entry.plateNumber, reason: entry.reason, status: entry.status });
        setModalOpen(true);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editId !== null) {
            // Find the original entry
            const original = blacklist.find(entry => entry.id === editId);
            if (!original) return;
            // Compute only changed fields
            const changedFields: Partial<import('../services/blacklist').UpdateBlacklistDto> = {};
            if (form.plateNumber !== original.plateNumber) changedFields.plateNumber = form.plateNumber;
            if (form.reason !== original.reason) changedFields.reason = form.reason;
            if (form.status !== original.status) changedFields.status = form.status;
            if (Object.keys(changedFields).length > 0) {
                const updated = await blacklistService.updateBlacklist(editId, changedFields);
                if (updated) {
                    setBlacklist(list => list.map(entry =>
                        entry.id === editId
                            ? { ...entry, ...changedFields }
                            : entry
                    ));
                    showNotification('success', 'Blacklist entry updated successfully');
                } else {
                    showNotification('error', 'Failed to update blacklist entry');
                }
            }
        }
        setModalOpen(false);
        setEditId(null);
        setForm({ plateNumber: '', reason: '', status: 'Active' });
    };

    const openAddModal = () => {
        setEditId(null);
        setForm({ plateNumber: '', reason: '', status: 'Active' });
        setModalOpen(true);
    };

    // Filtered blacklist
    const filteredBlacklist = blacklist.filter(entry =>
        (statusFilter === 'All' || entry.status === statusFilter) &&
        (
            (typeof entry.plateNumber === 'string' && entry.plateNumber.toLowerCase().includes(search.toLowerCase())) ||
            (typeof entry.reason === 'string' && entry.reason.toLowerCase().includes(search.toLowerCase())) ||
            (entry.addedBy && typeof entry.addedBy.username === 'string' && entry.addedBy.username.toLowerCase().includes(search.toLowerCase()))
        )
    );

    // Pagination
    const pageSize = 5;
    const totalPages = Math.ceil(filteredBlacklist.length / pageSize);
    const paginatedBlacklist = filteredBlacklist.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-inter p-8">
            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                    <button
                        className="flex items-center px-2 py-2 bg-gray-800 hover:bg-gray-700 rounded text-gray-300"
                        onClick={() => router.push('/dashboard')}
                        title="Back to Dashboard"
                    >
                        <FaArrowLeft />
                    </button>
                    <h1 className="text-2xl font-bold text-indigo-400">Blacklist</h1>
                </div>
                <button
                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold shadow"
                    onClick={openAddModal}
                >
                    <FaPlus className="mr-2" /> Add to Blacklist
                </button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center bg-gray-800 rounded px-3 py-2 w-full md:w-1/3">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search blacklist..."
                        className="bg-transparent outline-none w-full text-gray-200"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-gray-800 text-gray-200 rounded px-3 py-2"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        {statuses.map(status => <option key={status}>{status}</option>)}
                    </select>
                </div>
            </div>

            {/* Blacklist Table */}
            <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-700 text-gray-300">
                            <th className="px-4 py-2 text-left">Plate Number</th>
                            <th className="px-4 py-2 text-left">Added By</th>
                            <th className="px-4 py-2 text-left">Created At</th>
                            <th className="px-4 py-2 text-left">Reason</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-400">Loading...</td>
                            </tr>
                        ) : paginatedBlacklist.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-6 text-gray-400">No blacklist entries found.</td>
                            </tr>
                        ) : (
                            paginatedBlacklist.map(entry => (
                                <tr key={entry.id} className="border-b border-gray-700">
                                    <td className="px-4 py-2 align-top">{entry.plateNumber}</td>
                                    <td className="px-4 py-2 align-top">{entry.addedBy?.username || '-'}</td>
                                    <td className="px-4 py-2 align-top">{entry.createAt}</td>
                                    <td className="px-4 py-2 align-top">{entry.reason || '-'}</td>
                                    <td className="px-4 py-2 align-top">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${entry.status === 'Active' ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'}`}>{entry.status || '-'}</span>
                                    </td>
                                    <td className="px-4 py-2 align-top text-right">
                                        <button className="text-blue-400 hover:text-blue-200 p-1" title="Edit" onClick={() => openEditModal(entry)}><FaUserEdit /></button>
                                        <button className="text-red-400 hover:text-red-200 p-1 ml-2" title="Delete" onClick={() => handleDelete(entry.id)}><FaTrash /></button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="flex justify-end items-center gap-2 mt-4">
                <button
                    className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                    onClick={() => setPage(page - 1)}
                    disabled={page === 1}
                >
                    <FaChevronLeft />
                </button>
                <span className="text-gray-300">Page {page} of {totalPages || 1}</span>
                <button
                    className="px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                    onClick={() => setPage(page + 1)}
                    disabled={page === totalPages || totalPages === 0}
                >
                    <FaChevronRight />
                </button>
            </div>

            {/* Create Blacklist Modal */}
            <Transition show={modalOpen} as={Fragment}>
                <Dialog onClose={() => setModalOpen(false)} className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-black bg-opacity-60" />
                        </Transition.Child>
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <div className="bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6 z-50 relative">
                                <Dialog.Title className="text-lg font-bold text-indigo-400 mb-4">Add to Blacklist</Dialog.Title>
                                <form className="space-y-4" onSubmit={editId === null ? handleAdd : handleEdit}>
                                    <div>
                                        <label className="block text-sm mb-1 text-gray-200">Plate Number</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                                            value={form.plateNumber}
                                            onChange={e => setForm({ ...form, plateNumber: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1 text-gray-200 ">Reason</label>
                                        <input
                                            type="text" 
                                            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                                            value={form.reason}
                                            onChange={e => setForm({ ...form, reason: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1 text-gray-200">Status</label>
                                        <select
                                            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                                            value={form.status}
                                            onChange={e => setForm({ ...form, status: e.target.value })}
                                        >
                                            {statuses.filter(s => s !== 'All').map(status => <option key={status}>{status}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex justify-end gap-2 mt-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 rounded bg-gray-600 hover:bg-gray-500 text-gray-200"
                                            onClick={() => setModalOpen(false)}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-semibold"
                                        >
                                            {editId === null ? 'Add' : 'Update'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition>
        </div>
    );
}
