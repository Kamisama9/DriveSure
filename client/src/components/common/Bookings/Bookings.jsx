import { useEffect, useState, useCallback } from "react";
import BookingCards from "./BookingCards";
import {
	IndianRupeeIcon,
	Check,
	CircleDashed,
	X,
	TriangleAlert,
	Calendar,
	Search,
} from "lucide-react";
import { formatDateSafe } from "../../../utils/DateUtil";

const filterOptions = [
	{ label: "Pickup Address", value: "pickup" },
	{ label: "Dropoff Address", value: "dropoff" },
	{ label: "Date of Travelling", value: "travel_date" },
	{ label: "Booking Status", value: "status" },
];

const Bookings = ({ isRider = false }) => {
	const [selectedBooking, setSelectedBooking] = useState(null);
	const openBooking = (booking) => setSelectedBooking(booking);
	const closeBooking = () => setSelectedBooking(null);
	const [allBookings, setAllBookings] = useState([]);
	const [bookings, setBookings] = useState([]);
	const [rider, setRider] = useState(null);
	const [filterType, setFilterType] = useState(filterOptions[0].value);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const bookingsPerPage = 10;

	const normalize = (v) => (v ?? "").toString().trim().toLowerCase();

	const normalizeDateString = (input) => {
		if (!input) return "";
		const raw = input.toString().trim();

		const isoMatch = raw.match(/^(\d{4})-(\d{2})-(\d{2})$/);
		if (isoMatch) return raw;

		const dmy = raw.match(/^(\d{1,2})/ - /-$/);
		if (dmy) {
			const [_, d, m, y] = dmy;
			const year = y.length === 2 ? `20${y}` : y;
			const mm = String(m).padStart(2, "0");
			const dd = String(d).padStart(2, "0");
			return `${year}-${mm}-${dd}`;
		}

		const parsed = new Date(raw);
		if (!isNaN(parsed.getTime())) {
			const year = parsed.getFullYear();
			const mm = String(parsed.getMonth() + 1).padStart(2, "0");
			const dd = String(parsed.getDate()).padStart(2, "0");
			return `${year}-${mm}-${dd}`;
		}

		return raw.toLowerCase();
	};

	const getFieldValue = (booking, type) => {
		switch (type) {
			case "pickup":
				return booking?.pickup.address ?? "";
			case "dropoff":
				return booking?.dropoff.address ?? "";
			case "travel_date":
				return booking?.created_at ?? "";
			case "status":
				return booking?.booking_status ?? "";
			default:
				return "";
		}
	};

	useEffect(() => {
		(async () => {
			const response = await fetch(`http://localhost:4000/bookings`);
			const data = await response.json();
			setAllBookings(Array.isArray(data) ? data : []);
		})();
	}, []);

	useEffect(() => {
		if (searchTerm.trim() === "") {
			setBookings(allBookings);
			setCurrentPage(1);
			return;
		}

		const term = normalize(searchTerm);

		const filtered = allBookings.filter((b) => {
			const value = getFieldValue(b, filterType);

			if (filterType === "travel_date") {
				const valueKey = normalizeDateString(value);
				const termKey = normalizeDateString(searchTerm);

				if (valueKey && termKey) {
					return valueKey.includes(termKey);
				}
				return normalize(value).includes(term);
			}

			return normalize(value).includes(term);
		});

		setBookings(filtered);
		setCurrentPage(1);
	}, [allBookings, filterType, searchTerm]);

	useEffect(() => {
		if (selectedBooking) {
			const prev = document.body.style.overflow;
			document.body.style.overflow = "hidden";
			return () => (document.body.style.overflow = prev);
		}
	}, [selectedBooking]);

	useEffect(() => {
		const fetchRider = async () => {
			try {
				const riderRes = await fetch(
					"http://localhost:3005/riders/a1b2c3d4-e5f6-7890-abcd-1234567890ab"
				);
				const riderData = await riderRes.json();
				setRider(riderData);
			} catch (error) {
				console.error("Error fetching rider:", error);
			}
		};
		fetchRider();
	}, []);

	const indexOfLastBooking = currentPage * bookingsPerPage;
	const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
	const currentBookings = bookings.slice(
		indexOfFirstBooking,
		indexOfLastBooking
	);
	const totalPages = Math.ceil(bookings.length / bookingsPerPage);

	return (
		<>
			<div className="bg-white/95 rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 backdrop-blur-sm">
				<div className="flex flex-wrap items-center gap-6">
					<div className="flex flex-col min-w-[160px]">
						<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
							Filter by:
						</label>
						<select
							value={filterType}
							onChange={(e) => {
								setFilterType(e.target.value);
								setSearchTerm("");
							}}
							className="px-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
						>
							{filterOptions.map((opt) => (
								<option key={opt.value} value={opt.value}>
									{opt.label}
								</option>
							))}
						</select>
					</div>

					<div className="flex flex-col flex-grow min-w-[300px]">
						<label className="text-xs font-semibold text-gray-600 uppercase tracking-wide mb-2">
							Search:
						</label>
						<div className="relative">
							{filterType === "status" ? (
								<select
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full px-5 py-3 pl-12 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
								>
									<option value="">Select status</option>
									<option value="requested">Requested</option>
									<option value="in_progress">In Progress</option>
									<option value="completed">Completed</option>
									<option value="cancelled">Cancelled</option>
								</select>
							) : (
								<input
									type={filterType === "travel_date" ? "date" : "text"}
									placeholder={`Search by ${
										filterOptions.find((opt) => opt.value === filterType)?.label
									}`}
									value={searchTerm}
									onChange={(e) => setSearchTerm(e.target.value)}
									className="w-full px-5 py-3 pl-12 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 text-gray-800 placeholder-gray-500 border-2 border-gray-200 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all duration-200 font-medium"
								/>
							)}

							<div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
								<svg
									className="w-5 h-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
									/>
								</svg>
							</div>
						</div>
					</div>
				</div>
			</div>

			<ul className="space-y-4 flex-grow pb-32 mb-8">
				{currentBookings.map((booking) => (
					<li
						key={booking.id}
						onClick={() => openBooking(booking)}
						className="group relative bg-white/90 backdrop-blur-sm p-6 border border-gray-200 rounded-2xl shadow-lg cursor-pointer 
                     transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-blue-300
                     transform hover:scale-[1.02] overflow-hidden"
					>
						<div className="absolute inset-0 bg-gradient-to-r from-blue-50/0 to-indigo-50/0 group-hover:from-blue-50/50 group-hover:to-indigo-50/50 transition-all duration-300 rounded-2xl"></div>

						<div className="relative z-10 flex items-center justify-between gap-4">
							<div className="flex items-start space-x-4 flex-grow">
								<div className="flex-shrink-0">
									<div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110 overflow-hidden">
										{isRider ? (
											<img
												className="object-cover w-full h-full"
												src="https://tse2.mm.bing.net/th/id/OIP.roHntiwsK2sQ73ICkLPmaAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3"
											/>
										) : (
											<span className="text-xl font-bold text-white">
												{(rider.first_name?.[0] || "").toUpperCase()}
												{(rider.last_name?.[0] || "").toUpperCase()}
											</span>
										)}
									</div>
								</div>

								<div className="flex-grow min-w-0">
									<div className="flex items-center space-x-3 mb-3">
										<h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
											{booking.pickup.address} - {booking.dropoff.address}
										</h3>
									</div>

									<div className="grid grid-cols-1 gap-3 text-sm">
										<div className="flex items-center space-x-2 text-gray-600">
											<span className="text-blue-500">
												<Calendar />
											</span>
											<span className="font-medium">
												{formatDateSafe(booking.created_at, {
													locale: "en-IN",
													timeZone: "Asia/Kolkata",
													variant: "datetime",
													fallback: "—",
													assumeUTCForMySQL: true,
												})}
											</span>
										</div>
										<div className="flex items-center space-x-2">
											<span className="text-indigo-500">
												<IndianRupeeIcon />
											</span>
											<span className="font-medium capitalize text-gray-600">
												{booking.fare}
											</span>
											<span
												className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
													booking.booking_status === "completed"
														? "bg-green-100 text-green-800 border border-green-200"
														: booking.booking_status === "cancelled"
														? "bg-red-100 text-red-800 border border-red-200"
														: "bg-yellow-100 text-yellow-800 border border-yellow-200"
												}`}
											>
												{booking.booking_status === "completed" && <Check />}
												{booking.booking_status === "in_progress" && (
													<CircleDashed />
												)}
												{booking.booking_status === "cancelled" && <X />}
												{booking.booking_status === "requested" && (
													<TriangleAlert />
												)}
												{booking.booking_status}
											</span>
										</div>
									</div>
								</div>
							</div>

							<div className="flex-shrink-0 opacity-40 group-hover:opacity-100 group-hover:text-blue-500 transition-all duration-300 transform group-hover:translate-x-1">
								<svg
									width="24"
									height="24"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									strokeWidth="2"
									strokeLinecap="round"
									strokeLinejoin="round"
									className="transform group-hover:scale-110 transition-transform duration-300"
								>
									<polyline points="9,18 15,12 9,6"></polyline>
								</svg>
							</div>
						</div>

						<div className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 group-hover:w-full transition-all duration-300 rounded-b-2xl"></div>
					</li>
				))}
			</ul>

			{totalPages > 1 && (
				<div className="fixed bottom-0 left-50 right-0 py-6 z-10 bg-gradient-to-t from-white via-white/95 to-transparent backdrop-blur-md border-t border-gray-200">
					<div className="flex justify-center items-center space-x-3 overflow-x-auto px-4">
						<button
							onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
							disabled={currentPage === 1}
							className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
						>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M15 19l-7-7 7-7"
								/>
							</svg>
							<span className="hidden sm:inline">Previous</span>
						</button>

						<div className="flex space-x-2">
							{Array.from({ length: totalPages }, (_, i) => (
								<button
									key={i}
									onClick={() => setCurrentPage(i + 1)}
									className={`px-4 py-2 rounded-xl min-w-[3rem] font-semibold transition-all duration-200 shadow-sm ${
										currentPage === i + 1
											? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg transform scale-110"
											: "bg-white border-2 border-gray-200 text-gray-700 hover:border-blue-300 hover:text-blue-600 hover:shadow-md"
									}`}
								>
									{i + 1}
								</button>
							))}
						</div>

						<button
							onClick={() =>
								setCurrentPage(Math.min(totalPages, currentPage + 1))
							}
							disabled={currentPage === totalPages}
							className="px-4 py-2 rounded-xl bg-white border-2 border-gray-200 text-gray-600 hover:border-blue-300 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md flex items-center space-x-1"
						>
							<span className="hidden sm:inline">Next</span>
							<svg
								className="w-4 h-4"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M9 5l7 7-7 7"
								/>
							</svg>
						</button>
					</div>
				</div>
			)}

			{selectedBooking && (
				<BookingCards
					booking={selectedBooking}
					user={rider}
					isRider={isRider}
					onClose={closeBooking}
				/>
			)}
		</>
	);
};

export default Bookings;
