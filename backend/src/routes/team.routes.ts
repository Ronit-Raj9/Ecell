import express from 'express';

// Team routes will be implemented later
const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Team routes are under development'
  });
});

export default router; 