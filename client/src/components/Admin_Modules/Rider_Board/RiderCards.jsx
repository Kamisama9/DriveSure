import { useState, useEffect } from "react";
import { formatDateSafe, toMySQLFromDate } from "../../../utils/DateUtil";
import { toast, Bounce } from "react-toastify";

const RiderCards = ({ rider, onClose, onRefresh }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		phone_number: "",
		city: "",
		state: "",
		role_description: "",
		status: "active",
		created_at: "",
		updated_at: "",
	});

	useEffect(() => {
		if (rider) {
			setFormData({
				phone_number: rider.phone_number || "",
				city: rider.city || "",
				state: rider.state || "",
				role_description: rider.role_description || "",
				status: rider.status || "active",
				created_at: rider.created_at || "",
				updated_at: rider.updated_at || "",
			});
		}
	}, [rider]);

	if (!rider) return null;

	const stop = (e) => e.stopPropagation();

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleUpdate = async () => {
		try {
			const updatedAtMySQL = toMySQLFromDate(new Date(), {
				asUTC: true,
				withMs: true,
			});
			const response = await fetch(`http://localhost:3005/riders/${rider.id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					...rider,
					phone_number: formData.phone_number,
					city: formData.city,
					state: formData.state,
					role_description: formData.role_description,
					status: formData.status,
					created_at: formData.created_at,
					updated_at: updatedAtMySQL,
				}),
			});

			if (response.ok) {
				toast.success("Rider updated successfully!", {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					transition: Bounce,
				});
				setIsEditing(false);
				setFormData((prev) => ({ ...prev, updated_at: updatedAtMySQL }));
				if (onRefresh) onRefresh();
			} else {
				toast.error("Failed to update rider", {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					transition: Bounce,
				});
			}
		} catch (error) {
			console.error("Error updating rider:", error);
			toast.error("Error updating rider", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				transition: Bounce,
			});
		}
	};

	const handleDelete = async () => {
		const confirmDelete = new Promise((resolve) => {
			toast.warn(
				({ closeToast }) => (
					<div className="flex items-start gap-3">
						<div className="flex-1">
							<p className="mb-3">
								Are you sure you want to delete this rider?
							</p>
							<div className="flex gap-2">
								<button
									onClick={() => {
										closeToast();
										resolve(true);
									}}
									className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 hover:shadow-lg transition-all duration-200"
								>
									Delete
								</button>
								<button
									onClick={() => {
										closeToast();
										resolve(false);
									}}
									className="bg-gray-500 text-white px-3 py-1 rounded text-sm hover:bg-gray-600 hover:shadow-lg transition-all duration-200"
								>
									Cancel
								</button>
							</div>
						</div>
					</div>
				),
				{
					position: "top-center",
					autoClose: false,
					hideProgressBar: true,
					closeOnClick: false,
					pauseOnHover: false,
					draggable: false,
					closeButton: false,
					theme: "light",
					transition: Bounce,
					style: {
						alignItems: "flex-start",
					},
				}
			);
		});

		const shouldDelete = await confirmDelete;
		if (!shouldDelete) return;

		try {
			const response = await fetch(`http://localhost:3005/riders/${rider.id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				toast.error("Failed to delete rider", {
					position: "top-right",
					autoClose: 3000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
					transition: Bounce,
				});
				return;
			}

			toast.success("Rider deleted successfully!", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
				transition: Bounce,
			});

			if (onRefresh) {
				onRefresh();
			}
			onClose();
		} catch (error) {
			console.error("Error deleting rider:", error);
			toast.error("Error deleting rider", {
				position: "top-right",
				autoClose: 3000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
				transition: Bounce,
			});
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-md flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative transform transition-all duration-300 scale-100 hover:scale-[1.01]"
				onClick={stop}
			>
				<div className="p-8 bg-gradient-to-r from-blue-50 to-indigo-50">
					<button
						type="button"
						aria-label="Close"
						onClick={onClose}
						className="absolute top-4 right-4 z-50 inline-flex items-center justify-center
                            h-12 w-12 rounded-full cursor-pointer bg-white shadow-lg border border-gray-200
                            text-gray-600 hover:text-red-500 hover:bg-red-50 hover:border-red-200
                            ring-2 ring-transparent ring-offset-white
                            transition-all duration-200 ease-out transform hover:scale-110"
					>
						<span className="pointer-events-none text-xl font-medium leading-none">
							✕
						</span>
					</button>

					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
							<span className="text-3xl text-white font-bold">
								{(rider.first_name?.[0] || "").toUpperCase()}
								{(rider.last_name?.[0] || "").toUpperCase()}
							</span>
						</div>
						<h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
							{rider.first_name} {rider.last_name}
						</h2>
						<p className="text-gray-600 mt-2 text-lg">{rider.email}</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						{/* Fixed Fields */}
						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Email
							</label>
							<div className="text-gray-900 font-medium text-base">
								{rider.email}
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								First Name
							</label>
							<div className="text-gray-900 font-medium text-base">
								{rider.first_name}
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Last Name
							</label>
							<div className="text-gray-900 font-medium text-base">
								{rider.last_name}
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Middle Name
							</label>
							<div className="text-gray-900 font-medium text-base">
								{rider.middle_name || "—"}
							</div>
						</div>

						<div className="group bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl border border-purple-200 hover:shadow-md transition-all duration-200 hover:border-purple-300">
							<label className="block text-xs font-semibold text-purple-600 uppercase tracking-wide mb-2 group-hover:text-purple-700">
								Role
							</label>
							<div className="text-gray-900 font-medium text-base flex items-center">
								<span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
									{rider.role}
								</span>
							</div>
						</div>

						{/* Editable Fields */}
						<div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
							<label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-700">
								Phone Number
							</label>
							{isEditing ? (
								<input
									type="text"
									name="phone_number"
									value={formData.phone_number}
									onChange={handleInputChange}
									className="w-full p-3 text-base font-medium text-black bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
								/>
							) : (
								<div className="text-gray-900 font-medium text-base flex items-center">
									<span className="inline-flex items-center">
										📱 {formData.phone_number}
									</span>
								</div>
							)}
						</div>

						<div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
							<label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-700">
								City
							</label>
							{isEditing ? (
								<input
									type="text"
									name="city"
									value={formData.city}
									onChange={handleInputChange}
									className="w-full p-3 text-base font-medium text-black bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
								/>
							) : (
								<div className="text-gray-900 font-medium text-base flex items-center">
									<span className="inline-flex items-center">
										🏙️ {formData.city}
									</span>
								</div>
							)}
						</div>

						<div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
							<label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-700">
								State
							</label>
							{isEditing ? (
								<input
									type="text"
									name="state"
									value={formData.state}
									onChange={handleInputChange}
									className="w-full p-3 text-base font-medium text-black bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
								/>
							) : (
								<div className="text-gray-900 font-medium text-base flex items-center">
									<span className="inline-flex items-center">
										📍 {formData.state}
									</span>
								</div>
							)}
						</div>

						<div className="group bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200 hover:shadow-md transition-all duration-200 hover:border-blue-300">
							<label className="block text-xs font-semibold text-blue-600 uppercase tracking-wide mb-2 group-hover:text-blue-700">
								Role Description
							</label>
							{isEditing ? (
								<input
									type="text"
									name="role_description"
									value={formData.role_description}
									onChange={handleInputChange}
									className="w-full p-3 text-base font-medium text-black bg-white border-2 border-blue-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200"
								/>
							) : (
								<div className="text-gray-900 font-medium text-base">
									{formData.role_description}
								</div>
							)}
						</div>

						<div className="group bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl border border-green-200 hover:shadow-md transition-all duration-200 hover:border-green-300">
							<label className="block text-xs font-semibold text-green-600 uppercase tracking-wide mb-2 group-hover:text-green-700">
								Status
							</label>
							{isEditing ? (
								<select
									name="status"
									value={formData.status}
									onChange={handleInputChange}
									className="w-full p-3 text-base font-medium text-black bg-white border-2 border-green-200 rounded-lg focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all duration-200"
								>
									<option value="active">Active</option>
									<option value="suspended">Suspended</option>
								</select>
							) : (
								<div className="text-gray-900 font-medium text-base">
									<span
										className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
											formData.status === "active"
												? "bg-green-100 text-green-800 border border-green-200"
												: formData.status === "suspended"
												? "bg-yellow-100 text-yellow-800 border border-yellow-200"
												: formData.status === "deleted"
												? "bg-red-100 text-red-800 border border-red-200"
												: "bg-gray-100 text-gray-800 border border-gray-200"
										}`}
									>
										{formData.status === "active" && "✅"}
										{formData.status === "suspended" && "⚠️"}
										{formData.status === "deleted" && "❌"}
										{formData.status}
									</span>
								</div>
							)}
						</div>

						<div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 hover:shadow-md transition-all duration-200 hover:border-indigo-300">
							<label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 group-hover:text-indigo-700">
								Email Verified
							</label>
							<div className="text-gray-900 font-medium text-base">
								<span
									className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
										formData.is_email_verified
											? "bg-green-100 text-green-800 border border-green-200"
											: "bg-red-100 text-red-800 border border-red-200"
									}`}
								>
									{formData.is_email_verified
										? "✅ Verified"
										: "❌ Not Verified"}
								</span>
							</div>
						</div>

						<div className="group bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-xl border border-indigo-200 hover:shadow-md transition-all duration-200 hover:border-indigo-300">
							<label className="block text-xs font-semibold text-indigo-600 uppercase tracking-wide mb-2 group-hover:text-indigo-700">
								Phone Verified
							</label>
							<div className="text-gray-900 font-medium text-base">
								<span
									className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
										formData.is_phone_verified
											? "bg-green-100 text-green-800 border border-green-200"
											: "bg-red-100 text-red-800 border border-red-200"
									}`}
								>
									{formData.is_phone_verified
										? "✅ Verified"
										: "❌ Not Verified"}
								</span>
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Created At
							</label>
							<div className="text-gray-900 font-medium text-base flex items-center">
								<span className="inline-flex items-center">
									🗓️{" "}
									{formatDateSafe(formData.created_at, {
										locale: "en-IN",
										timeZone: "Asia/Kolkata",
										variant: "datetime",
										fallback: "—",
										assumeUTCForMySQL: true,
									})}
								</span>
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Updated At
							</label>
							<div className="text-gray-900 font-medium text-base flex items-center">
								<span className="inline-flex items-center">
									🔄{" "}
									{formatDateSafe(formData?.updated_at, {
										locale: "en-IN",
										timeZone: "Asia/Kolkata",
										variant: "datetime",
										fallback: "—",
										assumeUTCForMySQL: true,
									})}
								</span>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-center space-x-6 bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-200 shadow-sm">
						{isEditing ? (
							<>
								<button
									onClick={handleUpdate}
									className="group relative bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-xl font-semibold text-base
                           hover:from-green-600 hover:to-green-700 transform hover:scale-105 transition-all duration-200 
                           shadow-lg hover:shadow-xl flex items-center space-x-2"
								>
									<span>💾</span>
									<span>Save Changes</span>
								</button>
								<button
									onClick={() => setIsEditing(false)}
									className="group relative bg-gradient-to-r from-gray-400 to-gray-500 text-white px-8 py-3 rounded-xl font-semibold text-base
                           hover:from-gray-500 hover:to-gray-600 transform hover:scale-105 transition-all duration-200 
                           shadow-lg hover:shadow-xl flex items-center space-x-2"
								>
									<span>❌</span>
									<span>Cancel</span>
								</button>
							</>
						) : (
							<>
								<button
									onClick={() => setIsEditing(true)}
									className="group relative bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-3 rounded-xl font-semibold text-base
                           hover:from-blue-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 
                           shadow-lg hover:shadow-xl flex items-center space-x-2"
								>
									<span>✏️</span>
									<span>Edit Rider</span>
								</button>
								<button
									onClick={handleDelete}
									className="group relative bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-3 rounded-xl font-semibold text-base
                           hover:from-red-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 
                           shadow-lg hover:shadow-xl flex items-center space-x-2"
								>
									<span>🗑️</span>
									<span>Delete Rider</span>
								</button>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RiderCards;
