'use client'

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FaPlus, FaSearch, FaUserEdit, FaTrash, FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const usersData = [
    { id: 1, name: 'Alice Smith', email: 'alice@example.com', role: 'Admin', status: 'Active' },
    { id: 2, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'Inactive' },
    { id: 3, name: 'Charlie Lee', email: 'charlie@example.com', role: 'User', status: 'Active' },
    { id: 4, name: 'Dana White', email: 'dana@example.com', role: 'Moderator', status: 'Active' },
];

const roles = ['All', 'Admin', 'User'];
const statuses = ['All', 'Active', 'Inactive'];

export default function UsersPage() {
    const [modalOpen, setModalOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [roleFilter, setRoleFilter] = useState('All');
    const [statusFilter, setStatusFilter] = useState('All');
    const [page, setPage] = useState(1);
    const [users] = useState(usersData);
    const router = useRouter();

    // Modal form state
    const [form, setForm] = useState({ name: '', email: '', role: 'User', status: 'Active' });

    // Filtered users
    const filteredUsers = users.filter(u =>
        (roleFilter === 'All' || u.role === roleFilter) &&
        (statusFilter === 'All' || u.status === statusFilter) &&
        (u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()))
    );

    // Pagination
    const pageSize = 5;
    const totalPages = Math.ceil(filteredUsers.length / pageSize);
    const paginatedUsers = filteredUsers.slice((page - 1) * pageSize, page * pageSize);

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
                    <h1 className="text-2xl font-bold text-indigo-400">Users</h1>
                </div>
                <button
                    className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-semibold shadow"
                    onClick={() => setModalOpen(true)}
                >
                    <FaPlus className="mr-2" /> Create New User
                </button>
            </div>

            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                <div className="flex items-center bg-gray-800 rounded px-3 py-2 w-full md:w-1/3">
                    <FaSearch className="text-gray-400 mr-2" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="bg-transparent outline-none w-full text-gray-200"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="bg-gray-800 text-gray-200 rounded px-3 py-2"
                        value={roleFilter}
                        onChange={e => setRoleFilter(e.target.value)}
                    >
                        {roles.map(role => <option key={role}>{role}</option>)}
                    </select>
                    <select
                        className="bg-gray-800 text-gray-200 rounded px-3 py-2"
                        value={statusFilter}
                        onChange={e => setStatusFilter(e.target.value)}
                    >
                        {statuses.map(status => <option key={status}>{status}</option>)}
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-gray-800 rounded-lg shadow overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="bg-gray-700 text-gray-300">
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Email</th>
                            <th className="px-4 py-2 text-left">Role</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-6 text-gray-400">No users found.</td>
                            </tr>
                        ) : (
                            paginatedUsers.map(user => (
                                <tr key={user.id} className="border-b border-gray-700">
                                    <td className="px-4 py-2 align-top">{user.name}</td>
                                    <td className="px-4 py-2 align-top">{user.email}</td>
                                    <td className="px-4 py-2 align-top">{user.role}</td>
                                    <td className="px-4 py-2 align-top">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${user.status === 'Active' ? 'bg-green-700 text-green-200' : 'bg-red-700 text-red-200'}`}>{user.status}</span>
                                    </td>
                                    <td className="px-4 py-2 align-top text-right">
                                        <button className="text-blue-400 hover:text-blue-200 p-1" title="Edit"><FaUserEdit /></button>
                                        <button className="text-red-400 hover:text-red-200 p-1 ml-2" title="Delete"><FaTrash /></button>
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

            {/* Create User Modal */}
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
                                <Dialog.Title className="text-lg font-bold text-indigo-400 mb-4">Create New User</Dialog.Title>
                                <form className="space-y-4">
                                    <div>
                                        <label className="block text-sm mb-1">Name</label>
                                        <input
                                            type="text"
                                            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                                            value={form.name}
                                            onChange={e => setForm({ ...form, name: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm mb-1">Email</label>
                                        <input
                                            type="email"
                                            className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                                            value={form.email}
                                            onChange={e => setForm({ ...form, email: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <div className="flex-1">
                                            <label className="block text-sm mb-1">Role</label>
                                            <select
                                                className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                                                value={form.role}
                                                onChange={e => setForm({ ...form, role: e.target.value })}
                                            >
                                                {roles.filter(r => r !== 'All').map(role => <option key={role}>{role}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex-1">
                                            <label className="block text-sm mb-1">Status</label>
                                            <select
                                                className="w-full px-3 py-2 rounded bg-gray-700 text-gray-200 focus:outline-none"
                                                value={form.status}
                                                onChange={e => setForm({ ...form, status: e.target.value })}
                                            >
                                                {statuses.filter(s => s !== 'All').map(status => <option key={status}>{status}</option>)}
                                            </select>
                                        </div>
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
                                            onClick={e => { e.preventDefault(); setModalOpen(false); }}
                                        >
                                            Create
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
