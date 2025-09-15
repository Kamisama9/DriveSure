import { useState } from 'react';

const avatar = {
    "path": "/src/assets/testimonials/kickButtowski.avif",
    "name": "Administrator"
}

const AdminSiderBar = ({onSelect}) => {
  const [activeSelection, setActiveSelection] = useState(null);

  const handleSelect = (selection) => {
    if (activeSelection === selection) {
      // If clicking the same menu, deselect it
      setActiveSelection(null);
      onSelect?.(null);
    } else {
      // Otherwise, select the new menu
      setActiveSelection(selection);
      onSelect?.(selection);
    }
  };

  const getButtonClass = (selection) => {
    return `w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600 transition-colors duration-200 ${
      activeSelection === selection ? 'bg-red-600 text-white' : 'text-white'
    }`;
  };

  return (
      <aside className="shadow-lg bg-[#140604] fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out w-20 md:w-64 hidden md:block">
        <div className="h-40 border-b border-gray-600 flex flex-col items-center justify-center py-4">
          <img
            src={avatar.path}
            className="rounded-full w-24 h-24 object-cover border-4 border-white mb-2"
            alt="user"
          />
          <div className="text-center text-white font-semibold text-sm px-2">
            {avatar.name}
          </div>
        </div>

        {/* Rider Board */}
        <div className="mt-4 text-white">
          <button
            onClick={() => handleSelect("riderBoard")}
            className={getButtonClass("riderBoard")}
          >
            Rider Board
          </button>
        </div>

        {/* Driver Board */}
        <div className="mt-4 text-white">
          <button
            onClick={() => handleSelect("driverBoard")}
            className={getButtonClass("driverBoard")}
          >
            Driver Board
          </button>
        </div>

        {/* Verifications */}
        <div className="mt-4 text-white">
          <button
            onClick={() => handleSelect("verification")}
            className={getButtonClass("verification")}
          >
            Document & Verification
          </button>
        </div>

        {/* Feedback */}
        <div className="mt-4 text-white">
          <button
            onClick={() => handleSelect("feedback")}
            className={getButtonClass("feedback")}
          >
            Feedback and Grievances
          </button>
        </div>

        {/* Fare */}
        <div className="mt-4 text-white">
          <button
            onClick={() => handleSelect("fare")}
            className={getButtonClass("fare")}
          >
            Fare Board
          </button>
        </div>
        
        {/* Transaction Logs */}
        <div className="mt-4 text-white">
          <button
            onClick={() => handleSelect("transaction")}
            className={getButtonClass("transaction")}
          >
            Transactions
          </button>
        </div>
      </aside>
  );
};

export default AdminSiderBar;