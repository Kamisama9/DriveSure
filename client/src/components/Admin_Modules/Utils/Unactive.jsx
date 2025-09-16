const avatar = {
	path: "/src/assets/testimonials/kickButtowski.avif",
	name: "Administrator",
};

const Unactive = ({ onSelect }) => {
	return (
		<div className="flex items-center justify-center min-h-[80vh] bg-gradient-to-br from-gray-50 to-gray-100">
			<div className="text-center relative">
				{/* Watermark Background */}
				<div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none">
					<img
						src={avatar.path}
						alt="Watermark"
						className="w-96 h-96 object-cover rounded-full"
					/>
				</div>

				{/* Main Content */}
				<div className="relative z-10">
					<div className="mb-8">
						<img
							src={avatar.path}
							alt={avatar.name}
							className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-white shadow-lg"
						/>
					</div>

					<h1 className="text-4xl font-bold text-gray-800 mb-4">
						Welcome, {avatar.name}
					</h1>

					<p className="text-xl text-gray-600 mb-8 max-w-md mx-auto leading-relaxed">
						Select an option from the sidebar to manage your DriveSure platform
					</p>

					<div className="grid grid-cols-2 md:grid-cols-5 gap-4 max-w-4xl mx-auto text-sm text-gray-500">
						<div
							className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-purple-50 group"
							onClick={() => onSelect?.("riderBoard")}
						>
							<div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-purple-200 transition-colors duration-300">
								<span className="text-purple-600 font-bold">R</span>
							</div>
							<span className="group-hover:text-purple-700 transition-colors duration-300">
								Rider Board
							</span>
						</div>

						<div
							className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-orange-50 group"
							onClick={() => onSelect?.("driverBoard")}
						>
							<div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-orange-200 transition-colors duration-300">
								<span className="text-orange-600 font-bold">D</span>
							</div>
							<span className="group-hover:text-orange-700 transition-colors duration-300">
								Driver Board
							</span>
						</div>

						<div
							className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-green-50 group"
							onClick={() => onSelect?.("fare")}
						>
							<div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-green-200 transition-colors duration-300">
								<span className="text-green-600 font-bold">₹</span>
							</div>
							<span className="group-hover:text-green-700 transition-colors duration-300">
								Fare Board
							</span>
						</div>

						<div
							className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-blue-50 group"
							onClick={() => onSelect?.("transactions")}
						>
							<div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-blue-200 transition-colors duration-300">
								<span className="text-blue-600 font-bold">T</span>
							</div>
							<span className="group-hover:text-blue-700 transition-colors duration-300">
								Transactions
							</span>
						</div>

						<div
							className="flex flex-col items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:bg-indigo-50 group"
							onClick={() => onSelect?.("Verification")}
						>
							<div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-indigo-200 transition-colors duration-300">
								<span className="text-indigo-600 font-bold">V</span>
							</div>
							<span className="group-hover:text-indigo-700 transition-colors duration-300">
								Verifications
							</span>
						</div>
					</div>

					<div className="mt-12 text-gray-400 text-sm">
						<p>DriveSure Admin Dashboard</p>
						<p>Manage your ride-sharing platform efficiently</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Unactive;
