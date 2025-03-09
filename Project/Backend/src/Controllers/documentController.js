const fs = require('fs');
const path = require('path');
const db = require('../Config/db')
const matchDocuments = require('../utils/aiMatch');


//upload document logic
const uploadDocument = async(req,res)=>{

    if(!req.file){  //if no file is requested
       
        return res.status(400).json({ message: "No file uploaded" });

    }

    const filePath = path.join(__dirname, "../../public/uploads", req.file.filename);
 //set file path to store
    const userid = req.user.id;

    //read the file content
    fs.readFile(filePath, "utf-8", (err, content) => {
        if (err) {
            console.error("Error reading file:", err.message);
            return res.status(500).json({ message: "Error reading file" });
        }
    
//store in the db
        db.run(
            `INSERT INTO documents (user_id,filename,content) VALUES (?,?,?)`,
            [userid,req.file.filename,content],
            function(err){
                if(err){
                    console.error("error",err)
                    return res.status(500).json({message:"error uploading files"})
                }
                res.status(201).json({
                    id:this.lastID,
                    filename:req.file.filename,
                    message:"File uploaded succesfully"
                })
            }
        )
    })





}

//logic to match doc with AI



const matchDocumentAPI = async (req, res) => {  
    const docId = req.params.docId;

    db.get(`SELECT content FROM documents WHERE id = ?`, [docId], async (err, doc) => {
        if (err || !doc) {
            return res.status(404).json({ message: "Document not found" });
        }
        console.log("Uploaded Document Content:", doc.content);

        db.all(`SELECT content FROM documents WHERE id != ?`, [docId], async (err, docs) => {
            if (err || !docs.length) {
                return res.status(404).json({ message: "No matching documents found" });
            }

            const storedDocs = docs.map(d => d.content);
            console.log("Stored Documents for Matching:", storedDocs);

            // use AI to find the most similar document
            const result = await matchDocuments(doc.content, storedDocs);
            console.log("Matching Results:", result);

            res.json({ matches: result });
        });
    });
};


const getUserPastScans = (req, res) => {
    const userId = req.user.id;

    db.all(
        `SELECT id, filename FROM documents WHERE user_id = ? ORDER BY id DESC LIMIT 10`, 
        [userId], 
        (err, scans) => {
            if (err) {
                return res.status(500).json({ message: "Error fetching scan history" });
            }
            res.json({ scans });
        }
    );
};





module.exports =  {matchDocumentAPI,uploadDocument,getUserPastScans};

