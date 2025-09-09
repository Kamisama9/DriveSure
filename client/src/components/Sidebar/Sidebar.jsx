import { useState } from "react";


export default function Sidebar({ children, activeSection, setActiveSection, navItems }) {

  const avatar = {
    "path": "/src/assets/testimonials/kickButtowski.avif",
    "name": "Kick Buttowski"
}

  const [openSidebar, setOpenSidebar] = useState(false);

  return (
    <div className="font-sans min-h-screen flex flex-col md:flex-row h-[100vh]">
      {/* Sidebar */}
      <aside
        className={`shadow-lg bg-[#140604] fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out ${
          openSidebar ? "w-64" : "w-20 md:w-64"
        } ${!openSidebar && "hidden md:block"}`}
      >
        <div className="p-4 flex flex-col items-center justify-between border-b">
          <img
            src={avatar.path}
            className="mx-auto mt-6 rounded-full w-24 h-24 object-cover border-4 border-white"
            alt="user"
          />
          <div className="text-center text-white font-semibold mt-2">
            {avatar.name}
          </div>
          <button onClick={() => setOpenSidebar(!openSidebar)} className="md:hidden p-2 rounded-full text-black hover:bg-black"> 
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
                  className={`flex items-center space-x-3 px-4 py-2 hover:bg-[#2a0f0f] cursor-pointer hover:text-red-600 w-full rounded-lg transition-colors ${
                    activeSection === item.id ? 'bg-black' : ''

                  }`}
                >
                  <span
                    className={`text-gray-100 transition-opacity duration-300 `}
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
      <main className=" bg-gray-100 flex-1 p-4 md:p-6 overflow-y-auto">
        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center mb-4">

          <h1 className="text-xl font-bold text-red-600">Nomad Cabs</h1>
          <button onClick={() => setOpenSidebar((prev) => !prev)} className="p-2 rounded-full text-black hover:bg-gray-200">
            {openSidebar ? '←':'☰'}

          </button>
        </div>

        {/* Page Content */}
        {children}
      </main>
    </div>
  );
}
