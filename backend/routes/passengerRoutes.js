const express = require('express');
const router = express.Router();
const passengerService = require('../services/passengerService');

/**
 * 旅客報到 API
 * POST /api/passenger/checkin
 */
router.post('/checkin', async (req, res) => {
  try {
    const { idNumber, birthday, lineUid, lineDisplayName } = req.body;

    if (!idNumber || !birthday || !lineUid) {
      return res.status(400).json({ error: '缺少必要資訊' });
    }

    const lineData = {
      userId: lineUid,
      displayName: lineDisplayName
    };

    const result = await passengerService.upsertPassengerCheckIn(idNumber, birthday, lineData);
    
    res.json({
      success: true,
      message: result.alreadyCheckedIn ? '您已完成報到' : '報到成功',
      data: result
    });
  } catch (error) {
    console.error('Check-in Error:', error);
    res.status(400).json({ 
      success: false, 
      error: error.message || '報到處理失敗' 
    });
  }
});

module.exports = router;
