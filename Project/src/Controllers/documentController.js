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
    
//store in the DB
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



const matchDocument = async (req, res) => {
    const docId = req.params.docId;

    // Get the uploaded document content
    db.get(`SELECT content FROM documents WHERE id = ?`, [docId], async (err, doc) => {
        if (err || !doc) {
            return res.status(404).json({ message: "Document not found" });
        }

        // Get all other stored documents for comparison
        db.all(`SELECT content FROM documents WHERE id != ?`, [docId], async (err, docs) => {
            if (err || !docs.length) {
                return res.status(404).json({ message: "No matching documents found" });
            }

            // Extract content of stored documents
            const storedDocs = docs.map(d => d.content);

            // Use AI to find the most similar document
            const result = await matchDocuments(doc.content, storedDocs);

            res.json({ matches: result });
        });
    });
};





module.exports =  {matchDocument,uploadDocument};

