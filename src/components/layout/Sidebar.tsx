import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, BarChart, Users, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // SAFELY handle undefined user or user.name
  const userName = user && typeof user.name === "string" && user.name.length > 0 ? user.name : "Guest";
  const userInitial = user && typeof user.name === "string" && user.name.length > 0
    ? user.name.charAt(0).toUpperCase()
    : "?";
  const userEmail = user && typeof user.email === "string" ? user.email : "";

  const isAdmin = user && user.role === 'admin';

  const navItems = [
    { 
      name: 'Dashboard', 
      path: '/dashboard', 
      icon: <LayoutDashboard className="h-5 w-5" /> 
    },
    { 
      name: 'Products', 
      path: '/products', 
      icon: <Package className="h-5 w-5" /> 
    },
    { 
      name: 'Orders', 
      path: '/orders', 
      icon: <ShoppingCart className="h-5 w-5" /> 
    },
    { 
      name: 'Reports', 
      path: '/reports', 
      icon: <BarChart className="h-5 w-5" /> 
    },
    ...(isAdmin ? [{
      name: 'Users', 
      path: '/users', 
      icon: <Users className="h-5 w-5" /> 
    }] : []),
    { 
      name: 'Settings', 
      path: '/settings', 
      icon: <Settings className="h-5 w-5" /> 
    }
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <aside className={`bg-white border-r border-gray-200 w-64 h-screen fixed left-0 top-0 z-10 overflow-y-auto ${isOpen ? '' : 'hidden md:block'}`}>
      <div className="px-6 py-6">
        <div className="flex items-center mb-8">
          <div className="bg-blue-600 text-white p-2 rounded-md">
            <Package className="h-6 w-6" />
          </div>
          <h1 className="ml-3 text-xl font-bold text-gray-900">StockMaster</h1>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors
                ${isActive(item.path) 
                  ? 'bg-blue-50 text-blue-700' 
                  : 'text-gray-700 hover:bg-gray-100'}
              `}
            >
              <span className={`${isActive(item.path) ? 'text-blue-600' : 'text-gray-500'}`}>
                {item.icon}
              </span>
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-6 py-4 border-t border-gray-200 mt-auto">
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
        >
          <LogOut className="h-5 w-5 text-gray-500" />
          <span className="ml-3">Log out</span>
        </button>
        <div className="flex items-center mt-4 pt-4 border-t border-gray-200">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
              {userInitial}
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-gray-900 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
