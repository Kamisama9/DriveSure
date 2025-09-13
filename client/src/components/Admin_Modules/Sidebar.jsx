import { useState } from 'react';
import RightArrow from "../../assets/arrows/right-arrow.png";

const avatar = {
    "path": "/src/assets/testimonials/kickButtowski.avif",
    "name": "Administrator"
}

const AdminSiderBar = ({onSelect}) => {
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const toggleManageUsers = () => {
    setIsManageUsersOpen(!isManageUsersOpen);
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

        {/* Manage Users Section */}
        <div className="mt-4 text-white">
          <button
            onClick={toggleManageUsers}
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            User's Board
          </button>

          {isManageUsersOpen && (
            <div className="ml-4 bg-[#1f0a0a] rounded-md shadow-inner">
              <div className="flex items-center px-4 py-2 hover:bg-[#2a0f0f] cursor-pointer hover:text-red-600"
                onClick={() => onSelect?.("riderBoard")}
              >
                <img src={RightArrow} alt="arrow" className="w-4 h-4 mr-2" />
                Rider Board
              </div>
              <div className="flex items-center px-4 py-2 hover:bg-[#2a0f0f] cursor-pointer hover:text-red-600"
                onClick={() => onSelect?.("driverBoard")}
              >
                <img src={RightArrow} alt="arrow" className="w-4 h-4 mr-2" />
                Driver Board
              </div>
            </div>
          )}
        </div>

        {/* Manage Users Section */}
        <div className="mt-4 text-white">
          <button
            onClick={() => onSelect?.("Verification")}
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            Verifications
          </button>
        </div>

        {/* Feedback */}
        <div className="mt-4 text-white">
          <button
            onClick={() => onSelect?.("feedback")}
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            Feedback and Grievances
          </button>
        </div>

        {/* Fare */}
        <div className="mt-4 text-white">
          <button
            onClick={() => onSelect?.("fare")}
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            Fare Board
          </button>
        </div>
        
        {/* Transaction Logs */}
        <div className="mt-4 text-white">
          <button
            onClick={() => onSelect?.("transactions")}
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            Transactions
          </button>
        </div>
      </aside>
  );
};

export default AdminSiderBar;