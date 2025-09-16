import { formatDateSafe } from "../../../utils/DateUtil";

const TransactionCards = ({ transaction, onClose }) => {
	if (!transaction) return null;

	const stop = (e) => e.stopPropagation();

	const getStatusBadge = (status) => {
		const statusClasses = {
			completed: "bg-green-100 text-green-800",
			cancelled: "bg-red-100 text-red-800",
			ongoing: "bg-blue-100 text-blue-800",
			pending: "bg-yellow-100 text-yellow-800",
		};
		return statusClasses[status] || "bg-gray-100 text-gray-800";
	};

	const getPaymentBadge = (status) => {
		const statusClasses = {
			paid: "bg-green-100 text-green-800",
			cancelled: "bg-red-100 text-red-800",
			pending: "bg-yellow-100 text-yellow-800",
			failed: "bg-red-100 text-red-800",
		};
		return statusClasses[status] || "bg-gray-100 text-gray-800";
	};

	return (
		<div
			className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div
				className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] overflow-y-auto no-scrollbar relative mx-auto my-auto"
				onClick={stop}
			>
				<div className="p-6">
					{/* Close Button */}
					<button
						type="button"
						aria-label="Close"
						onClick={onClose}
						className="absolute top-3 right-3 z-50 inline-flex items-center justify-center
                            h-11 w-11 rounded-full cursor-pointer
                            text-gray-600 hover:text-blue-700 hover:bg-gray-100
                            ring-2 ring-transparent ring-offset-white
                            transition-colors duration-150 ease-out"
					>
						<span className="pointer-events-none text-2xl leading-none text-black">
							×
						</span>
					</button>

					{/* Header */}
					<div className="mb-6">
						<h2 className="text-2xl font-bold text-gray-800 mb-2">
							Transaction Details
						</h2>
						<div className="flex items-center gap-4">
							<span className="text-lg font-medium text-gray-600">
								Booking ID: {transaction.id}
							</span>
							<span
								className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
									transaction.booking_status
								)}`}
							>
								{transaction.booking_status}
							</span>
						</div>
					</div>

					{/* Main Content - Vertical Layout */}
					<div className="space-y-6">
						{/* Trip Information */}
						<div className="bg-blue-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Trip Information
							</h3>
							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Pickup Location
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded">
										{transaction.pickup_address}
									</div>
									<div className="text-xs text-gray-500 mt-1">
										Coordinates: {transaction.pickup_lat},{" "}
										{transaction.pickup_lng}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Drop Location
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded">
										{transaction.drop_address}
									</div>
									<div className="text-xs text-gray-500 mt-1">
										Coordinates: {transaction.drop_lat}, {transaction.drop_lng}
									</div>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Distance
										</label>
										<div className="text-gray-900 text-sm bg-white p-2 rounded">
											{transaction.distance_km} km
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Duration
										</label>
										<div className="text-gray-900 text-sm bg-white p-2 rounded">
											{transaction.estimated_duration_min} min
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Payment Information */}
						<div className="bg-green-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Payment Information
							</h3>
							<div className="space-y-3">
								<div className="grid grid-cols-2 gap-4">
									<div>
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Fare Amount
										</label>
										<div className="text-2xl font-bold text-green-600 bg-white p-2 rounded">
											₹{transaction.fare}
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-600 mb-1">
											Payment Status
										</label>
										<div className="bg-white p-2 rounded">
											<span
												className={`px-3 py-1 rounded-full text-sm font-medium ${getPaymentBadge(
													transaction.payment_status
												)}`}
											>
												{transaction.payment_status}
											</span>
										</div>
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Rate per KM
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded">
										₹
										{transaction.distance_km > 0
											? (transaction.fare / transaction.distance_km).toFixed(2)
											: "0.00"}
										/km
									</div>
								</div>
							</div>
						</div>

						{/* Rider Information */}
						<div className="bg-purple-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Rider Information
							</h3>
							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Name
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded font-medium">
										{transaction.rider_name}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Phone Number
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded">
										{transaction.rider_phone}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Rider ID
									</label>
									<div className="text-gray-900 text-xs bg-white p-2 rounded font-mono">
										{transaction.rider_id}
									</div>
								</div>
							</div>
						</div>

						{/* Driver Information */}
						<div className="bg-orange-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Driver Information
							</h3>
							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Name
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded font-medium">
										{transaction.driver_name}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Phone Number
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded">
										{transaction.driver_phone}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Driver ID
									</label>
									<div className="text-gray-900 text-xs bg-white p-2 rounded font-mono">
										{transaction.driver_id}
									</div>
								</div>
							</div>
						</div>

						{/* Timeline Information */}
						<div className="bg-gray-50 p-4 rounded-lg">
							<h3 className="text-lg font-semibold text-gray-800 mb-4">
								Timeline
							</h3>
							<div className="space-y-3">
								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Booking Created
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded">
										{formatDateSafe(transaction.created_at, {
											locale: "en-IN",
											timeZone: "Asia/Kolkata",
											variant: "datetime",
											fallback: "—",
											assumeUTCForMySQL: true,
										})}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Last Updated
									</label>
									<div className="text-gray-900 text-sm bg-white p-2 rounded">
										{formatDateSafe(transaction.updated_at, {
											locale: "en-IN",
											timeZone: "Asia/Kolkata",
											variant: "datetime",
											fallback: "—",
											assumeUTCForMySQL: true,
										})}
									</div>
								</div>

								<div>
									<label className="block text-sm font-medium text-gray-600 mb-1">
										Booking Status
									</label>
									<div className="bg-white p-2 rounded">
										<span
											className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(
												transaction.booking_status
											)}`}
										>
											{transaction.booking_status}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex justify-center mt-8 pt-6 border-t border-gray-200">
						<button
							onClick={onClose}
							className="bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition duration-300 font-medium"
						>
							Close
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TransactionCards;
