const Booking = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-800">Welcome Back, John Doe!</h1>
        <p className="text-gray-600">Here's what's happening with your account today.</p>
      </header>
      <div className="grid grid-cols-1 gap-4">
        <Card title="Total Orders" value="12" color="text-green-600" />
        <Card title="Pending Orders" value="3" color="text-yellow-600" />
        <Card title="Total Spent" value="$500.00" color="text-blue-600" />
      </div>
    </div>
  );
}

const Card = ({ title, value, color }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
      <p className={`text-2xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

export default Booking;