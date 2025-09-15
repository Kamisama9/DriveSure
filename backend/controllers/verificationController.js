const db = require('../config/db');

// Get all pending verifications
exports.getPendingVerifications = async (req, res) => {
  try {
    const query = `
      SELECT 
        v.id,
        v.document_id,
        v.status,
        v.reviewed_at,
        v.rejection_reason,
        v.created_at,
        v.updated_at,
        d.owner_type as entity_type,
        d.owner_id as entity_id,
        d.document_type as verification_type,
        d.document_number,
        d.file_mime as document_mime,
        d.file_size as document_size
      FROM verifications v
      JOIN documents d ON v.document_id = d.id
      WHERE v.status = 'pending'
      ORDER BY v.created_at DESC
    `;
    
    const [results] = await db.execute(query);
    
    // Add document_url and submitted_at for compatibility
    const formattedResults = results.map(verification => ({
      ...verification,
      document_url: `/uploads/documents/${verification.document_id}`,
      submitted_at: verification.created_at
    }));
    
    res.json({
      success: true,
      data: formattedResults
    });
  } catch (error) {
    console.error('Error fetching pending verifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending verifications'
    });
  }
};

// Get verification history (approved/rejected)
exports.getVerificationHistory = async (req, res) => {
  try {
    const query = `
      SELECT 
        v.id,
        v.document_id,
        v.status,
        v.reviewed_at,
        v.rejection_reason,
        v.created_at,
        v.updated_at,
        d.owner_type as entity_type,
        d.owner_id as entity_id,
        d.document_type as verification_type,
        d.document_number,
        d.file_mime as document_mime,
        d.file_size as document_size
      FROM verifications v
      JOIN documents d ON v.document_id = d.id
      WHERE v.status IN ('verified', 'rejected')
      ORDER BY v.reviewed_at DESC
    `;
    
    const [results] = await db.execute(query);
    
    // Add document_url and submitted_at for compatibility
    const formattedResults = results.map(verification => ({
      ...verification,
      document_url: `/uploads/documents/${verification.document_id}`,
      submitted_at: verification.created_at
    }));
    
    res.json({
      success: true,
      data: formattedResults
    });
  } catch (error) {
    console.error('Error fetching verification history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch verification history'
    });
  }
};

// Update verification status
exports.updateVerificationStatus = async (req, res) => {
  const { verificationId } = req.params;
  const { status, rejectionReason } = req.body;
  
  if (!['verified', 'rejected', 'pending'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be verified, rejected, or pending'
    });
  }

  const connection = await db.getConnection();
  
  try {
    await connection.beginTransaction();

    // Get verification details
    const [verificationRows] = await connection.execute(`
      SELECT v.*, d.owner_type, d.owner_id, d.document_type 
      FROM verifications v
      JOIN documents d ON v.document_id = d.id
      WHERE v.id = ?
    `, [verificationId]);

    if (verificationRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({
        success: false,
        message: 'Verification not found'
      });
    }

    const verification = verificationRows[0];
    const reviewedAt = status === 'pending' ? null : new Date();

    // Update verification status
    await connection.execute(`
      UPDATE verifications 
      SET status = ?, reviewed_at = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP(6)
      WHERE id = ?
    `, [status, reviewedAt, rejectionReason || null, verificationId]);

    // If verification is approved, update corresponding driver/vehicle flags
    if (status === 'verified') {
      if (verification.owner_type === 'driver') {
        const flagColumn = `is_${verification.document_type}_verified`;
        await connection.execute(`
          UPDATE drivers SET ${flagColumn} = TRUE, updated_at = CURRENT_TIMESTAMP(6)
          WHERE id = ?
        `, [verification.owner_id]);
      } else if (verification.owner_type === 'vehicle') {
        const flagColumn = `is_${verification.document_type}_verified`;
        await connection.execute(`
          UPDATE vehicles SET ${flagColumn} = TRUE, updated_at = CURRENT_TIMESTAMP(6)
          WHERE id = ?
        `, [verification.owner_id]);
      }
    }

    // If verification is reset to pending, reset the corresponding flag
    if (status === 'pending') {
      if (verification.owner_type === 'driver') {
        const flagColumn = `is_${verification.document_type}_verified`;
        await connection.execute(`
          UPDATE drivers SET ${flagColumn} = FALSE, updated_at = CURRENT_TIMESTAMP(6)
          WHERE id = ?
        `, [verification.owner_id]);
      } else if (verification.owner_type === 'vehicle') {
        const flagColumn = `is_${verification.document_type}_verified`;
        await connection.execute(`
          UPDATE vehicles SET ${flagColumn} = FALSE, updated_at = CURRENT_TIMESTAMP(6)
          WHERE id = ?
        `, [verification.owner_id]);
      }
    }

    await connection.commit();

    res.json({
      success: true,
      message: `Verification ${status} successfully!`,
      data: {
        id: verificationId,
        status,
        reviewedAt,
        rejectionReason: rejectionReason || null
      }
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error updating verification status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update verification status'
    });
  } finally {
    connection.release();
  }
};

// Get all entities (drivers and vehicles)
exports.getAllEntities = async (req, res) => {
  try {
    // Get all drivers
    const driversQuery = `
      SELECT d.*, u.first_name, u.last_name, u.email, u.phone_number
      FROM drivers d
      JOIN users u ON d.user_id = u.id
    `;
    const [driverRows] = await db.execute(driversQuery);

    // Get all vehicles
    const vehiclesQuery = `SELECT * FROM vehicles`;
    const [vehicleRows] = await db.execute(vehiclesQuery);

    res.json({
      success: true,
      data: {
        drivers: driverRows,
        vehicles: vehicleRows
      }
    });
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entities'
    });
  }
};

// Get entity details (driver or vehicle) with all their verifications
exports.getEntityVerifications = async (req, res) => {
  const { entityType, entityId } = req.params;
  
  if (!['driver', 'vehicle'].includes(entityType)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid entity type. Must be driver or vehicle'
    });
  }

  try {
    // Get entity details
    let entityQuery, entityTable;
    if (entityType === 'driver') {
      entityTable = 'drivers';
      entityQuery = `
        SELECT d.*, u.first_name, u.last_name, u.email, u.phone_number
        FROM drivers d
        JOIN users u ON d.user_id = u.id
        WHERE d.id = ?
      `;
    } else {
      entityTable = 'vehicles';
      entityQuery = `SELECT * FROM vehicles WHERE id = ?`;
    }

    const [entityRows] = await db.execute(entityQuery, [entityId]);
    
    if (entityRows.length === 0) {
      return res.status(404).json({
        success: false,
        message: `${entityType.charAt(0).toUpperCase() + entityType.slice(1)} not found`
      });
    }

    // Get all verifications for this entity
    const verificationsQuery = `
      SELECT 
        v.id,
        v.document_id,
        v.status,
        v.reviewed_at,
        v.rejection_reason,
        v.created_at,
        v.updated_at,
        d.document_type as verification_type,
        d.document_number,
        d.file_mime as document_mime,
        d.file_size as document_size
      FROM verifications v
      JOIN documents d ON v.document_id = d.id
      WHERE d.owner_type = ? AND d.owner_id = ?
      ORDER BY v.created_at DESC
    `;

    const [verificationRows] = await db.execute(verificationsQuery, [entityType, entityId]);
    
    // Add document_url and submitted_at for compatibility
    const formattedVerifications = verificationRows.map(verification => ({
      ...verification,
      document_url: `/uploads/documents/${verification.document_id}`,
      submitted_at: verification.created_at
    }));

    res.json({
      success: true,
      data: {
        entityType,
        entityDetails: entityRows[0],
        verifications: formattedVerifications
      }
    });

  } catch (error) {
    console.error('Error fetching entity verifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch entity verifications'
    });
  }
};
