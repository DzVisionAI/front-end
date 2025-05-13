import React from 'react';
import PageIllustration from '../ui/page-illustration';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <main className="grow">            {/* You can add a sidebar or dashboard-specific header here */}
            <PageIllustration />

            {children}
        </main>
    );
}
