import { useState } from 'react';
import RightArrow from "../../assets/arrows/right-arrow.png";

const avatar = {
    "path": "/src/assets/testimonials/kickButtowski.avif",
    "name": "Kick Buttowski"
}

const AdminSiderBar = () => {
  const [isManageUsersOpen, setIsManageUsersOpen] = useState(false);
  const [isVerifiyOpen, setisVerifyOpen] = useState(false);
  const [isFeedbackOpen, setFeedback] = useState(false);

  const toggleManageUsers = () => {
    setIsManageUsersOpen(!isManageUsersOpen);
  };

   const toggleVerify = () => {
    setisVerifyOpen(!isVerifiyOpen);
  };

  const renderFeedback = () => {
    setFeedback(true);
  }

  return (
    <div className="font-sans min-h-screen flex flex-col md:flex-row h-[100vh] bg-white">
      {/* Sidebar */}
      <aside className="shadow-lg bg-[#140604] fixed md:static inset-y-0 left-0 z-50 transition-all duration-300 ease-in-out w-20 md:w-64 hidden md:block">
        <div className="h-[18vh] border-b">
          <img
            src={avatar.path}
            className="mx-auto mt-6 rounded-full w-24 h-24 object-cover border-4 border-white"
            alt="user"
          />
          <div className="text-center text-white font-semibold mt-2">
            {avatar.name}
          </div>
        </div>

        {/* Manage Users Section */}
        <div className="mt-4 text-white">
          <button
            onClick={toggleManageUsers}
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            Manage Users
          </button>

          {isManageUsersOpen && (
            <div className="ml-4 bg-[#1f0a0a] rounded-md shadow-inner">
              <div className="flex items-center px-4 py-2 hover:bg-[#2a0f0f] cursor-pointer hover:text-red-600">
                <img src={RightArrow} alt="arrow" className="w-4 h-4 mr-2" />
                Rider Board
              </div>
              <div className="flex items-center px-4 py-2 hover:bg-[#2a0f0f] cursor-pointer hover:text-red-600">
                <img src={RightArrow} alt="arrow" className="w-4 h-4 mr-2" />
                Driver Board
              </div>
              <div className="flex items-center px-4 py-2 hover:bg-[#2a0f0f] cursor-pointer hover:text-red-600">
                <img src={RightArrow} alt="arrow" className="w-4 h-4 mr-2" />
                Vehicles Board
              </div>
            </div>
          )}
        </div>

        {/* Manage Users Section */}
        <div className="mt-4 text-white">
          <button
            onClick={toggleVerify}
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            Manage Verifications
          </button>

          {isVerifiyOpen && (
            <div className="ml-4 bg-[#1f0a0a] rounded-md shadow-inner">
              <div className="flex items-center px-4 py-2 hover:bg-[#2a0f0f] cursor-pointer hover:text-red-600">
                <img src={RightArrow} alt="arrow" className="w-4 h-4 mr-2" />
                Verify Drivers 
              </div>
              <div className="flex items-center px-4 py-2 hover:bg-[#2a0f0f] cursor-pointer hover:text-red-600">
                <img src={RightArrow} alt="arrow" className="w-4 h-4 mr-2" />
                Verify Vehicles 
              </div>
            </div>
          )}
        </div>

        {/* Feedback */}
        <div className="mt-4 text-white">
          <button
            onClick={renderFeedback}
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            Feedback and Grievances
          </button>
        </div>

        {/* Fare */}
        <div className="mt-4 text-white">
          <button
            className="w-full text-left px-4 py-4 hover:bg-[#1f0a0a] font-semibold hover:text-red-600"
          >
            Manage Fare
          </button>
        </div>

      </aside>

      <main className="bg-gray-100 flex-1 p-4 md:p-6 overflow-y-auto">
          Main
      </main>
    </div>
  );
};

export default AdminSiderBar;