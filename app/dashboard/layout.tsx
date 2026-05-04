"use client";
import { TopBar } from './components/TopBar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      {/* 
          SIDEBAR REMOVED FROM HERE 
          It is now handled by (bar)/layout.tsx and (entertainer)/layout.tsx
      */}

      <div className="flex-1 flex flex-col min-w-0 h-full">
        <TopBar />
        
        <main className="flex-1 overflow-y-auto bg-[#fcfcfc]">
          {children}
        </main>
      </div>
    </div>
  );
}