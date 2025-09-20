'use client';
import React from 'react';
import { useRouter } from 'next/router';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout({ children, activeSection, setActiveSection }) {
  const router = useRouter();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <main className="ml-60 flex-1">{children}</main>
    </div>
  );
}
