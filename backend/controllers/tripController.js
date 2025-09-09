// controllers/tripController.js
const db = require("../config/db");

exports.getMyTrips = (req, res) => {
  const userId = req.session.user.id;
  const role = req.session.user.role;
  const filter = role === "driver" ? "t.driver_id" : "t.rider_id";

  const sql = `
    SELECT
      t.id             AS tripId,
      b.pickup_location,
      b.dropoff_location,
      t.start_time,
      t.end_time,
      t.distance_km,
      t.fare,
      t.status,
      r.name           AS riderName,
      d.name           AS driverName
    FROM trips t
    JOIN bookings b   ON t.booking_id = b.id
    JOIN users r      ON t.rider_id   = r.id
    JOIN users d      ON t.driver_id  = d.id
    WHERE ${filter} = ?
    ORDER BY t.start_time DESC
  `;

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ trips: results });
  });
};
