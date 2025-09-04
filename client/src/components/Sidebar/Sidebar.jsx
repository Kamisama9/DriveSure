import React, { useState } from 'react';

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠' },
  { id: 'orders', label: 'Orders', icon: '📦' },
  { id: 'profile', label: 'Profile', icon: '👤' },
];

export default function Sidebar({ children, activeSection, setActiveSection }) {
  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="bg-gray-100 font-sans min-h-screen flex flex-col md:flex-row h-[100vh]">
      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${
          openSidebar ? 'w-64' : 'w-20 md:w-64'
        } ${!openSidebar && 'hidden md:block'}`}
      >
        <div className="p-4 flex items-center justify-between border-b">
          <h1
            className={`text-xl font-bold text-green-600 transition-opacity duration-300 ${
              openSidebar ? 'opacity-100' : 'opacity-0 hidden md:block'
            }`}
          >
            E-Commerce
          </h1>
          <button onClick={() => setOpenSidebar(!openSidebar)} className="md:hidden p-2 rounded-full hover:bg-gray-200">
            ☰
          </button>
        </div>
        <nav className="py-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    setActiveSection(item.id);
                    setOpenSidebar(false);
                  }}
                  className={`flex items-center space-x-3 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors ${
                    activeSection === item.id ? 'bg-gray-100' : ''
                  }`}
                >
                  <span className="text-gray-600">{item.icon}</span>
                  <span
                    className={`text-gray-700 transition-opacity duration-300 ${
                      openSidebar ? 'block opacity-100' : 'hidden opacity-0 md:block'
                    }`}
                  >
                    {item.label}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <h1 className="text-xl font-bold text-gray-800">E-Commerce</h1>
          <button onClick={() => setOpenSidebar((prev) => !prev)} className="p-2 rounded-full hover:bg-gray-200">
            ☰
          </button>
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
