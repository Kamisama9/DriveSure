const router = require("express").Router();
const { getMyTrips } = require("../controllers/tripController");

router.get("/", getMyTrips);

module.exports = router;
