import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="h-screen bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col md:fixed md:inset-y-0">
        <Sidebar />
      </div>
      
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
          <div 
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleSidebar}
          ></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <Sidebar />
          </div>
        </div>
      )}
      
      {/* Content area */}
      <div className="md:pl-64 flex flex-col flex-1">
        <Header toggleSidebar={toggleSidebar} />
        
        <main className="flex-1 pt-16 pb-8 md:px-8 px-4 max-w-7xl mx-auto w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;