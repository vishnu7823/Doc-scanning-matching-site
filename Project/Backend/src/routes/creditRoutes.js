const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

const{requestCredits,processCreditrequests,getallCredits,resetDailycredits} = require('../Controllers/creditController')


router.post("/request", authMiddleware, requestCredits);
router.post("/process", authMiddleware, processCreditrequests);
router.get("/balance", authMiddleware, getallCredits);
router.post('/reset',authMiddleware,(req,res)=>{
      resetDailycredits();
      res.json({message:"rest sucessfully"})
})

module.exports = router;
