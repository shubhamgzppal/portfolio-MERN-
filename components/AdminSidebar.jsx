'use client';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';

const navItems = [
  { id: 'profile', label: 'Profile', href: '/Admin/EditProfile' },
  { id: 'project', label: 'Project', href: '/Admin/EditProject' },
  { id: 'certificate', label: 'certificate', href: '/Admin/EditCertificate' },
  { id: 'education', label: 'education', href: '/Admin/EditEducation' },
  { id: 'resume', label: 'resume', href: '/Admin/EditResume' },
];

export default function AdminSidebar() {
  const router = useRouter();

  const handleLogout = () => { Cookies.remove("adminAccess"); router.push('/') }

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-gray-900 text-white shadow-lg z-50 flex flex-col">
      <Link href="/Admin/AdminDashboard" className={`p-6 text-xl font-bold border-b border-gray-700 hover:text-primary transition-colors
          ${router.pathname === '/Admin/AdminDashboard' ? 'text-primary' : ''}`}
      >Dashboard
      </Link>

      <nav className="flex flex-col p-4 space-y-2 flex-grow">
        {navItems.map((item) => (
          <Link key={item.id} href={item.href} className={`text-left px-4 py-2 rounded-md transition-all font-medium
              ${router.pathname === item.href ? 'bg-primary text-white' : 'hover:bg-gray-700 text-gray-300'}`}
          >{item.label}
          </Link>
        ))}
      </nav>

      <div className="p-4 text-sm text-gray-400 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full mb-6 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">LogOut</button>
        <h4 className="text-center">&copy; {new Date().getFullYear()} Shubham Pal</h4>
        <p className="text-center">All rights reserved.</p>
      </div>
    </aside>
  );
}
