const { request } = require('express');
const db  = require('../Config/db');
const { userlogin } = require('./authController');


//reduce credit per scan for user profile
const reduceCredits = (req, res, next) => {
    const userId = req.user.id;

    db.get(`SELECT credits FROM users WHERE id = ?`, [userId], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.credits <= 0) {
            return res.status(403).json({ message: "Insufficient credits" });
        }

        db.run(`UPDATE users SET credits = credits - 1 WHERE id = ?`, [userId], (err) => {
            if (err) {
                return res.status(500).json({ message: "Failed to reduce credits" });
            }
            console.log(`Credits deducted for user ${userId}`);
            next(); // Move to the next middleware (uploadDocument)
        });
    });
};


//request credits for user
const requestCredits  =async(req,res)=>{

    const userId = req.user.id;
    const {amount} = req.body;

    if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid credit amount" });
    }

    db.run(`INSERT INTO credit_requests (user_id,amount,status) VALUES(?,?,'pending')`,[userId,amount],
        function(err){
            if(err){
                console.error(" Error inserting credit request:", err);
                return res.status(500).json({message:"error submiting request"})
            }

            res.status(201).json({requestId:this.lastID,message:"credits request submitted"})
        }
    )


}


//approval/deny of request fro admin

const processCreditrequests = async (req, res) => {
    const { requestId, status } = req.body;

    if (!["approved", "denied"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    // Get credit request along with username
    db.get(
        `SELECT credit_requests.*, users.username 
         FROM credit_requests 
         JOIN users ON credit_requests.user_id = users.id 
         WHERE credit_requests.id = ?`,
        [requestId],
        (err, request) => {
            if (err || !request) {
                console.error("Error fetching credit request:", err);
                return res.status(404).json({ message: "Request not found" });
            }

            if (status === "approved") {
                db.run(
                    `UPDATE users SET credits = credits + ? WHERE id = ?`,
                    [request.amount, request.user_id],
                    (err) => {
                        if (err) {
                            console.error("Error updating user credits:", err);
                            return res.status(500).json({ message: "Failed to update credits" });
                        }

                        db.run(
                            `UPDATE credit_requests SET status = 'approved' WHERE id = ?`,
                            [requestId],
                            (err) => {
                                if (err) {
                                    console.error("Error updating credit request status:", err);
                                    return res.status(500).json({ message: "Failed to update request status" });
                                }
                                res.json({ message: `Credit request approved for ${request.username}` });
                            }
                        );
                    }
                );
            } else {
                db.run(
                    `UPDATE credit_requests SET status = 'denied' WHERE id = ?`,
                    [requestId],
                    (err) => {
                        if (err) {
                            console.error("Error updating request status:", err);
                            return res.status(500).json({ message: "Failed to deny request" });
                        }
                        res.json({ message: `Credit request denied for ${request.username}` });
                    }
                );
            }
        }
    );
};

//this is for adminanalytics dashboard
const getallCredits = (req, res) => {
    db.all(
        `SELECT credit_requests.id, credit_requests.user_id, credit_requests.amount, credit_requests.status, users.username 
         FROM credit_requests 
         JOIN users ON credit_requests.user_id = users.id 
         WHERE credit_requests.status = 'pending'`,
        [],
        (err, requests) => {
            if (err) {
                console.error("Database Error:", err);
                return res.status(500).json({ message: "Error fetching requests" });
            }
            res.json({ request: requests });
        }
    );
};


//daily credit reset

const resetDailycredits = ()=>{
    db.run(`UPDATE users SET credits = 20`, (err) => {
        if (err)
            {
                console.error("Error resetting credits:", err);
                console.error(" Error resetting credits:", err);
            }
        else console.log("Daily credits reset for all users");
    });
}

module.exports = {reduceCredits,requestCredits,processCreditrequests,getallCredits,resetDailycredits};


