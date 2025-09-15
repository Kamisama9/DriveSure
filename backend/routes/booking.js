const { booking } = require("../controllers/bookingController");

const router = require("express").Router();

router.post("/",booking)

module.exports = router;