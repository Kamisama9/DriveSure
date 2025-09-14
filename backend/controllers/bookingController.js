

const BOOKINGS_FILE = "./booking.json";
const DRIVERS_FILE = "./driverlist.json";
const RIDERS_FILE = "./rider.json";

const loadJSON = (file) => JSON.parse(fs.readFileSync(file, "utf8"));
const saveJSON = (file, data) => fs.writeFileSync(file, JSON.stringify(data, null, 2));

exports.booking = (req, res) => {
  const { riderId, pickup, drop, vehicleType, paymentMode } = req.body;

  if ( !pickup || !drop || !vehicleType) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const drivers = loadJSON(DRIVERS_FILE);
  
  const bookings = loadJSON(BOOKINGS_FILE);
  
  // 3️⃣ Match drivers by vehicle type
  const availableDrivers = drivers.filter(
    (d) => d.vehicleType.toLowerCase() === vehicleType.toLowerCase()
  );
  if (availableDrivers.length === 0) {
    return res.status(400).json({ error: "No drivers available for this vehicle type" });
  }

  // 4️⃣ Pick random driver
  const driver = availableDrivers[Math.floor(Math.random() * availableDrivers.length)];

  // 5️⃣ Create booking object (schema you gave)
  const booking = {
    id: uuidv4(),
    pickup,
    dropoff: drop,
    driver_id: driver.id,
    rider_id: rider.id,
    vehicle_id: driver.vehicleId || uuidv4(), // if driver has vehicleId else generate
    booking_status: "requested",
    fare: null,
    distance: null,
    payment_status: "pending",
    payment_id: uuidv4(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // 6️⃣ Save to booking.json
  bookings.push(booking);
  saveJSON(BOOKINGS_FILE, bookings);

  // 7️⃣ Update driverlist.json
const driverIndex = drivers.findIndex((d) => d.id === driver.id);
if (driverIndex !== -1) {
  // add bookings array if not exists
  if (!drivers[driverIndex].bookings) {
    drivers[driverIndex].bookings = [];
  }
  drivers[driverIndex].bookings.push(booking.id);
  drivers[driverIndex].updated_at = new Date().toISOString();
  saveJSON(DRIVERS_FILE, drivers);
}

// Riders JSON load
const ridersData = loadJSON(RIDERS_FILE); // { riders: [...] }
const riders = ridersData.riders;

// Rider find
const rider = riders.find((r) => r.id === riderId);
if (!rider) {
  return res.status(400).json({ error: "Invalid riderId" });
}

// Update rider bookings
const riderIndex = riders.findIndex((r) => r.id === rider.id);
if (riderIndex !== -1) {
  if (!riders[riderIndex].bookings) {
    riders[riderIndex].bookings = [];
  }
  riders[riderIndex].bookings.push(booking.id);
  riders[riderIndex].updated_at = new Date().toISOString();

  // SAVE back in correct shape
  saveJSON(RIDERS_FILE, { riders });
}


  // 9️⃣ Respond
  res.json(booking);
};

