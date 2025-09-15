const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Updated file paths to point to the mock-server directory
const MOCK_SERVER_DIR = path.join(__dirname, '../mock-server');
const BOOKINGS_FILE = path.join(MOCK_SERVER_DIR, 'bookings.json');
const DRIVERS_FILE = path.join(MOCK_SERVER_DIR, 'drivers.json');
const VEHICLES_FILE = path.join(MOCK_SERVER_DIR, 'vehicles.json');
const RIDERS_FILE = path.join(MOCK_SERVER_DIR, 'riderlist.json');

const loadJSON = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch (error) {
    console.error(`Error loading ${file}:`, error);
    return { drivers: [], riders: [], bookings: [], vehicles: [] };
  }
};

const saveJSON = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error saving to ${file}:`, error);
    throw error;
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { riderId, pickup, drop, vehicleType, paymentMode } = req.body;

    // Validate required fields
    if (!riderId || !pickup || !drop || !vehicleType) {
      return res.status(400).json({ 
        success: false,
        message: "Missing required fields: riderId, pickup, drop, and vehicleType are required" 
      });
    }

    // Load all required data
    const { drivers } = loadJSON(DRIVERS_FILE);
    const { vehicles } = loadJSON(VEHICLES_FILE);
    const { riders } = loadJSON(RIDERS_FILE);
    let { bookings } = loadJSON(BOOKINGS_FILE);

    if (!bookings) bookings = [];

    // Validate rider exists
    const rider = riders.find(r => r.id === riderId);
    if (!rider) {
      return res.status(404).json({ 
        success: false, 
        message: "Rider not found" 
      });
    }

    // Find available drivers with matching vehicle type
    const availableDrivers = drivers.filter(driver => {
      const vehicle = vehicles.find(v => v.id === driver.vehicle_id);
      return vehicle && vehicle.type.toLowerCase() === vehicleType.toLowerCase();
    });

    if (availableDrivers.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: "No drivers available with the requested vehicle type" 
      });
    }

    // Select random available driver
    const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];
    const vehicle = vehicles.find(v => v.id === driver.vehicle_id);

    // Calculate estimated fare and distance (mock values for now)
    const estimatedDistance = Math.floor(Math.random() * 20) + 1; // 1-20 km
    const baseFare = 50;
    const perKmRate = 15;
    const estimatedFare = baseFare + (estimatedDistance * perKmRate);

    // Create booking object according to schema
    const booking = {
      id: uuidv4(),
      pickup: {
        address: pickup,
        coordinates: {
          lat: 0, 
          lng: 0
        }
      },
      dropoff: {
        address: drop,
        coordinates: {
          lat: 0, 
          lng: 0
        }
      },
      driver_id: driver.id,
      rider_id: riderId,
      vehicle_id: vehicle.id,
      booking_status: "requested",
      fare: estimatedFare,
      distance: estimatedDistance,
      payment_mode: paymentMode || "cash",
      payment_status: "pending",
      payment_id: uuidv4(),
      driver_name: driver.name,
      driver_contact: driver.phone_number,
      vehicle_model: vehicle.model,
      vehicle_plate: vehicle.registration_number,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    // Save booking
    bookings.push(booking);
    console.log('New booking created:', booking);
    saveJSON(BOOKINGS_FILE, { bookings });

    // Update driver's booking list
    const driverIndex = drivers.findIndex(d => d.id === driver.id);
    if (driverIndex !== -1) {
      if (!drivers[driverIndex].bookings) {
        drivers[driverIndex].bookings = [];
      }
      drivers[driverIndex].bookings.push(booking.id);
      drivers[driverIndex].updated_at = new Date().toISOString();
      saveJSON(DRIVERS_FILE, { drivers });
    }

    // Update rider's booking list
    const riderIndex = riders.findIndex(r => r.id === riderId);
    if (riderIndex !== -1) {
      if (!riders[riderIndex].bookings) {
        riders[riderIndex].bookings = [];
      }
      riders[riderIndex].bookings.push(booking.id);
      riders[riderIndex].updated_at = new Date().toISOString();
      saveJSON(RIDERS_FILE, { riders });
    }

    // Respond with success
    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      data: booking
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

// exports.getBookings = (req, res) => {
//   try {
//     const { bookings = [] } = loadJSON(BOOKINGS_FILE);
    
//     // Add filters if needed
//     const { status, payment_status } = req.query;
//     let filteredBookings = [...bookings];

//     if (status) {
//       filteredBookings = filteredBookings.filter(
//         booking => booking.booking_status === status
//       );
//     }

//     if (payment_status) {
//       filteredBookings = filteredBookings.filter(
//         booking => booking.payment_status === payment_status
//       );
//     }

//     // Sort by creation date, newest first
//     filteredBookings.sort((a, b) => 
//       new Date(b.created_at) - new Date(a.created_at)
//     );

//     res.json({
//       success: true,
//       count: filteredBookings.length,
//       data: filteredBookings
//     });

//   } catch (error) {
//     console.error('Error fetching bookings:', error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching bookings",
//       error: error.message
//     });
//   }
// };

// // Get single booking by ID
// exports.getBooking = (req, res) => {
//   try {
//     const { id } = req.params;
//     const { bookings = [] } = loadJSON(BOOKINGS_FILE);
    
//     const booking = bookings.find(b => b.id === id);
    
//     if (!booking) {
//       return res.status(404).json({
//         success: false,
//         message: "Booking not found"
//       });
//     }

//     res.json({
//       success: true,
//       data: booking
//     });

//   } catch (error) {
//     console.error('Error fetching booking:', error);
//     res.status(500).json({
//       success: false,
//       message: "Error fetching booking",
//       error: error.message
//     });
//   }
// };

