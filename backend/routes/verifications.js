const express = require('express');
const router = express.Router();
const verificationController = require('../controllers/verificationController');

// Get all pending verifications
router.get('/pending', verificationController.getPendingVerifications);

// Get verification history (approved/rejected)
router.get('/history', verificationController.getVerificationHistory);

// Get all entities (drivers and vehicles)
router.get('/entities', verificationController.getAllEntities);

// Update verification status
router.patch('/:verificationId/status', verificationController.updateVerificationStatus);

// Get entity verifications (driver or vehicle with all their verifications)
router.get('/entity/:entityType/:entityId', verificationController.getEntityVerifications);

module.exports = router;
