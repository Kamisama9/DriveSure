import { useState, useEffect } from "react";
import { formatDateSafe } from "../../../utils/DateUtil";
import {
	Check,
	CircleDashed,
	IndianRupee,
	TriangleAlert,
	X,
} from "lucide-react";

const BookingCards = ({ booking, onClose }) => {
	const [rider, setRider] = useState({});

	useEffect(() => {
		const fetchRider = async () => {
			try {
				const response = await fetch(
					"http://localhost:3005/riders/a1b2c3d4-e5f6-7890-abcd-1234567890ab"
				);
				const data = await response.json();
				setRider(data);
			} catch (error) {
				console.error("Error fetching rider:", error);
			}
		};
		fetchRider();
	}, []);

	return (
		<div
			className="fixed inset-0 z-50 bg-gradient-to-br from-black/50 to-black/30 backdrop-blur-md flex items-center justify-center p-4"
			onClick={onClose}
		>
			<div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-3xl max-h-[90vh] overflow-y-auto no-scrollbar relative transform transition-all duration-300 scale-100 hover:scale-[1.01]">
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
							<X />
						</span>
					</button>

					<div className="text-center mb-8">
						<div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg overflow-hidden">
							<img
								className="object-cover w-full h-full"
								src="https://tse2.mm.bing.net/th/id/OIP.roHntiwsK2sQ73ICkLPmaAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
							/>
						</div>
						<p className="text-gray-600 mt-2 text-lg">
							{formatDateSafe(booking.created_at, {
								locale: "en-IN",
								timeZone: "Asia/Kolkata",
								variant: "datetime",
								fallback: "—",
								assumeUTCForMySQL: true,
							})}
						</p>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Pickup
							</label>
							<div className="text-gray-900 font-medium text-base">
								{booking.pickup.address}
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Dropoff
							</label>
							<div className="text-gray-900 font-medium text-base">
								{booking.dropoff.address}
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Rider Name
							</label>
							<div className="text-gray-900 font-medium text-base">
								{rider.first_name} {rider.last_name}
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Rider Mobile Number
							</label>
							<div className="text-gray-900 font-medium text-base">
								{rider.phone_number}
							</div>
						</div>

						<div className="group bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover:border-gray-300">
							<label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 group-hover:text-gray-600">
								Fare
							</label>
							<div className="text-gray-900 font-medium text-base flex items-center">
								<span className="inline-flex items-center">
									<IndianRupee />
									{booking.fare}
								</span>
							</div>
						</div>

						<div
							className={`group bg-gradient-to-br p-4 rounded-xl border hover:shadow-md transition-all duration-200 ${
								booking.booking_status === "completed"
									? "from-green-50 to-green-100 border-green-200 hover:border-green-300"
									: booking.booking_status === "cancelled"
									? "from-red-50 to-red-100 border-red-200 hover:border-red-300"
									: "from-yellow-50 to-yellow-100 border-yellow-200 hover:border-yellow-300"
							}`}
						>
							<label
								className={`block text-xs font-semibold uppercase tracking-wide mb-2 ${
									booking.booking_status === "completed"
										? "text-green-600 group-hover:text-green-700"
										: booking.booking_status === "cancelled"
										? "text-red-600 group-hover:text-red-700"
										: "text-yellow-600 group-hover:text-yellow-700"
								}`}
							>
								Status
							</label>
							<div className="text-gray-900 font-medium text-base">
								<span
									className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
										booking.booking_status === "completed"
											? "bg-green-100 text-green-800 border border-green-200"
											: booking.booking_status === "cancelled"
											? "bg-red-100 text-red-800 border border-red-200"
											: "bg-yellow-100 text-yellow-800 border border-yellow-200"
									}`}
								>
									{booking.booking_status === "completed" && <Check />}
									{booking.booking_status === "in_progress" && <CircleDashed />}
									{booking.booking_status === "cancelled" && <X />}
									{booking.booking_status === "requested" && <TriangleAlert />}
									{booking.booking_status}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default BookingCards;
