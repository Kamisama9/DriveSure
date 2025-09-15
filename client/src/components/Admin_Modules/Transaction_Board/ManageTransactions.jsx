import { useState, useEffect, useCallback, useRef } from 'react';
import { toast, Bounce } from 'react-toastify';
import { formatDateSafe } from '../Utils/DateUtil';
import TransactionCards from './TransactionCards';

const ManageTransactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isFiltered, setIsFiltered] = useState(false); // Track if any filters are applied
  const hasShownErrorRef = useRef(false); // Track if we've shown error toast
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [fareFilter, setFareFilter] = useState('all');
  const [fareValue, setFareValue] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 10;

  const fetchTransactions = useCallback(async (silent = false) => {
    try {
      setLoading(true);
      hasShownErrorRef.current = false; // Reset error state on new attempt

      const response = await fetch('http://localhost:4001/bookings');
      const bookingsData = await response.json();
      
      // Fetch users and drivers data to enrich transaction data
      const usersResponse = await fetch('http://localhost:4001/users');
      const usersData = await usersResponse.json();
      
      const driversResponse = await fetch('http://localhost:4001/drivers');
      const driversData = await driversResponse.json();
      
      // Create lookup maps
      const usersMap = usersData.reduce((acc, user) => {
        acc[user.id] = user;
        return acc;
      }, {});
      
      const driversMap = driversData.reduce((acc, driver) => {
        acc[driver.id] = driver;
        return acc;
      }, {});
      
      // Filter for only completed and cancelled bookings
      const filteredBookings = bookingsData.filter(booking => 
        booking.booking_status === 'completed' || booking.booking_status === 'cancelled'
      );
      
      // Enrich bookings with user and driver data
      const enrichedTransactions = filteredBookings.map(booking => {
        const rider = usersMap[booking.rider_id];
        const driver = driversMap[booking.driver_id];
        const driverUser = driver ? usersMap[driver.user_id] : null;
        
        return {
          ...booking,
          rider_name: rider ? `${rider.first_name} ${rider.last_name}` : 'Unknown Rider',
          rider_phone: rider ? rider.phone_number : 'N/A',
          driver_name: driverUser ? `${driverUser.first_name} ${driverUser.last_name}` : 'Unknown Driver',
          driver_phone: driverUser ? driverUser.phone_number : 'N/A',
        };
      });
      
      // Sort transactions by updated_at date in descending order (latest first)
      const sortedTransactions = enrichedTransactions.sort((a, b) => {
        return new Date(b.updated_at) - new Date(a.updated_at);
      });
      
      setTransactions(sortedTransactions);
      // Initially show only latest 10 transactions
      setFilteredTransactions(sortedTransactions.slice(0, 10));
    } catch (error) {
      console.error('Error fetching transactions:', error);
      // Only show toast if not silent and we haven't shown an error in this session
      if (!silent && !hasShownErrorRef.current) {
        toast.error('Failed to fetch transactions', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
          transition: Bounce,
        });
        hasShownErrorRef.current = true;
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Call fetchTransactions only once on component mount
    fetchTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this only runs once

  // Wrapper function for refresh calls to avoid duplicate toasts
  const handleRefresh = useCallback(() => {
    fetchTransactions(true); // silent = true for refresh operations
  }, [fetchTransactions]);

  // Filter function
  useEffect(() => {
    // Check if any filters are applied
    const hasActiveFilters = searchTerm || statusFilter !== 'all' || 
      (fareFilter !== 'all' && fareValue) || dateFilter;
    
    if (!hasActiveFilters) {
      // No filters applied - show latest 10 transactions
      setFilteredTransactions(transactions.slice(0, 10));
      setIsFiltered(false);
    } else {
      // Filters applied - show all matching transactions
      let filtered = [...transactions];

      // Search by booking ID
      if (searchTerm) {
        filtered = filtered.filter(transaction =>
          transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }

      // Filter by booking status
      if (statusFilter !== 'all') {
        filtered = filtered.filter(transaction => transaction.booking_status === statusFilter);
      }

      // Filter by fare
      if (fareFilter !== 'all' && fareValue) {
        const value = parseFloat(fareValue);
        filtered = filtered.filter(transaction => {
          switch (fareFilter) {
            case 'equal':
              return transaction.fare === value;
            case 'greater':
              return transaction.fare >= value;
            case 'less':
              return transaction.fare <= value;
            default:
              return true;
          }
        });
      }

      // Filter by date (updated_at)
      if (dateFilter) {
        filtered = filtered.filter(transaction => {
          const transactionDate = new Date(transaction.updated_at).toISOString().split('T')[0];
          return transactionDate === dateFilter;
        });
      }

      setFilteredTransactions(filtered);
      setIsFiltered(true);
    }
    
    setCurrentPage(1); // Reset to first page when filters change
  }, [transactions, searchTerm, statusFilter, fareFilter, fareValue, dateFilter]);

  const openTransaction = (transaction) => {
    setSelectedTransaction(transaction);
  };

  const closeTransaction = () => {
    setSelectedTransaction(null);
  };

  // Display transactions with pagination (max 10 per page)
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentTransactions = filteredTransactions.slice(indexOfFirstRecord, indexOfLastRecord);
  const totalPages = Math.ceil(filteredTransactions.length / recordsPerPage);
  
  // Calculate exact table height based on number of records
  const getTableHeight = () => {
    const headerHeight = 64; // Height of table header
    const rowHeight = 80; // Height of each row (h-20 = 80px)
    const recordCount = Math.min(currentTransactions.length, recordsPerPage);
    
    return headerHeight + (rowHeight * recordCount);
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      ongoing: 'bg-blue-100 text-blue-800',
      pending: 'bg-yellow-100 text-yellow-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = (status) => {
    const statusClasses = {
      paid: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-4 flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-gray-600">Loading transactions...</div>
      </div>
    );
  }

  return (
    <div className="p-4 flex flex-col min-h-screen">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Transaction Logs</h1>
        <p className="text-gray-600">Manage and view all booking transactions</p>
      </div>

      {/* Advanced Filters */}
      <div className="bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">Filter Transactions</h3>
        
        {/* First Row: Search and Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Search by Booking ID
            </label>
            <input
              type="text"
              placeholder="Enter booking ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white text-black placeholder-gray-400 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Booking Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Filter by Date (Updated)
            </label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-4 py-2 rounded bg-white text-black border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
            />
          </div>
        </div>

        {/* Second Row: Fare Filter */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fare Condition
            </label>
            <select
              value={fareFilter}
              onChange={(e) => setFareFilter(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-100 text-gray-700 border border-gray-300 hover:border-black focus:border-black focus:outline-none transition"
            >
              <option value="all">All Fares</option>
              <option value="equal">Equal to (=)</option>
              <option value="greater">Greater than or equal (≥)</option>
              <option value="less">Less than or equal (≤)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fare Amount (₹)
            </label>
            <input
              type="number"
              placeholder="Enter amount"
              step="0.01"
              value={fareValue}
              onChange={(e) => setFareValue(e.target.value)}
              disabled={fareFilter === 'all'}
              className={`w-full px-4 py-2 rounded border border-gray-300 transition ${
                fareFilter === 'all'
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white text-black hover:border-black focus:border-black focus:outline-none'
              }`}
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setFareFilter('all');
                setFareValue('');
                setDateFilter('');
                // Reset to show latest 10 transactions
                setFilteredTransactions(transactions.slice(0, 10));
                setIsFiltered(false);
                setCurrentPage(1);
              }}
              className="w-full bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-200 font-medium"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Summary */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {isFiltered 
              ? `Showing ${filteredTransactions.length} of ${transactions.length} transactions (filtered)`
              : `Showing latest ${Math.min(10, transactions.length)} of ${transactions.length} transactions`
            }
          </p>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex-shrink-0">
        <div 
          className="overflow-x-auto" 
          style={{ height: `${getTableHeight()}px` }}
        >
          <table className="w-full h-full">
            <thead className="bg-gray-900 text-white sticky top-0 z-10">
              <tr>
                <th className="px-4 py-4 text-left text-sm font-semibold min-w-[120px]">Booking ID</th>
                <th className="px-4 py-4 text-left text-sm font-semibold min-w-[150px]">Rider</th>
                <th className="px-4 py-4 text-left text-sm font-semibold min-w-[150px]">Driver</th>
                <th className="px-4 py-4 text-left text-sm font-semibold min-w-[200px]">Route</th>
                <th className="px-4 py-4 text-left text-sm font-semibold min-w-[100px]">Fare (₹)</th>
                <th className="px-4 py-4 text-left text-sm font-semibold min-w-[100px]">Status</th>
                <th className="px-4 py-4 text-left text-sm font-semibold min-w-[100px]">Payment</th>
                <th className="px-4 py-4 text-left text-sm font-semibold min-w-[120px]">Updated</th>
              </tr>
            </thead>
            <tbody>
              {currentTransactions.map((transaction, index) => (
                <tr 
                  key={transaction.id} 
                  className={`border-b hover:bg-gray-50 cursor-pointer transition-colors duration-200 h-20 ${
                    index === currentTransactions.length - 1 ? 'border-b-2' : ''
                  }`}
                  onClick={() => openTransaction(transaction)}
                >
                  <td className="px-4 py-4 text-sm font-medium text-black align-middle h-20">
                    {transaction.id}
                  </td>
                  <td className="px-4 py-4 text-sm align-middle h-20">
                    <div className="text-black font-medium">{transaction.rider_name}</div>
                    <div className="text-gray-500 text-xs mt-1">{transaction.rider_phone}</div>
                  </td>
                  <td className="px-4 py-4 text-sm align-middle h-20">
                    <div className="text-black font-medium">{transaction.driver_name}</div>
                    <div className="text-gray-500 text-xs mt-1">{transaction.driver_phone}</div>
                  </td>
                  <td className="px-4 py-4 text-sm align-middle h-20">
                    <div className="text-black font-medium truncate max-w-40" title={transaction.pickup_address}>
                      From: {transaction.pickup_address}
                    </div>
                    <div className="text-gray-500 text-xs truncate max-w-40 mt-1" title={transaction.drop_address}>
                      To: {transaction.drop_address}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-semibold text-black align-middle h-20">
                    ₹{transaction.fare}
                  </td>
                  <td className="px-4 py-4 text-sm align-middle h-20">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(transaction.booking_status)}`}>
                      {transaction.booking_status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm align-middle h-20">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPaymentBadge(transaction.payment_status)}`}>
                      {transaction.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-sm text-black align-middle h-20">
                    {formatDateSafe(transaction.updated_at, {
                      locale: 'en-IN',
                      timeZone: 'Asia/Kolkata',
                      variant: 'date',
                      fallback: '—',
                      assumeUTCForMySQL: true,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {currentTransactions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No transactions found matching your filters.
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded ${
              currentPage === 1
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Previous
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-2 rounded min-w-[2.5rem] ${
                currentPage === i + 1
                  ? "bg-red-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {i + 1}
            </button>
          ))}
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className={`px-3 py-2 rounded ${
              currentPage === totalPages
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Next
          </button>
        </div>
      )}

      {/* Transaction Details Modal */}
      {selectedTransaction && (
        <TransactionCards 
          transaction={selectedTransaction}
          onClose={closeTransaction}
          onRefresh={handleRefresh}
        />
      )}
    </div>
  );
};

export default ManageTransactions;
