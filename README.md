Project title:  self-contained document scanning and matching system

#Project overview
This sysem allows user to scan their documents with limit of 20 credits per day which means a user can scan their documents 20 times in a day
and still user can request more credits so the admin accept or reject it.with AI the scanned document returns the result match that the files are
matching with other files or not.
Admins can manage credit requests sent by the user and user analytics dashboard.

#Project setup instructions

1.clone repository
https://github.com/vishnu7823/Doc-scanning-matching-site.git

2.Install necessary dependencies
npm install express sqlite3 dotenv cors nodemon path fs cron bcrypt multer
inside the pckage.json file add this dev script
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev":"nodemon index.js"   --this line fro auto trigerring the server if any changes happens --
  },

3.Set up environmental variables  file for secure
create  a .env file in the Project/Backend - create here
inside the file :

PORT = 8000
JWT_SECRET_KEY = your generated key
GEMINI_API_KEY = your gemini api key

Script to generate JWT token:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

4.start the server
Project/Backend - nodemon index.js -- this will help to start the server

5.Database setup
Create a database folder inside the project
Project/Backend/src/ - here create a data folder and inside the folder create database.sqlite
the path is  - Project/Backend/src/data/database.sqlite

GO to the sqlite shell by using this command
Project/Backend/src/data/ - sqlite3 database.sqlite
it will get into sqlite shell then proceed with creating tables:


CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL,
    credits INTEGER DEFAULT 20
);

CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    filename TEXT NOT NULL,
    content TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE credit_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    amount INTEGER NOT NULL,
    status TEXT DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

Check if table exists:
.tables - if yes then proceed to insert admin and users

#first insert admin 
INSERT INTO users (username, password, role, credits) 
VALUES ('your_adminname', 'Your_admin_password', 'admin', 20);
after inserting run the adminpasshash.js file which is located in or need to create it
Project/Backend/src/adminpasshash.js

const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database('./src/data/database.sqlite');

const username = "your_admin username"; //that you insert in db
const plainPassword = "your_admin password"; 

bcrypt.hash(plainPassword, 10, (err, hash) => {
    if (err) {
        console.error("Error hashing password:", err);
        return;
    }
    
    db.run(`UPDATE users SET password = ? WHERE username = ?`, [hash, username], (err) => {
        if (err) {
            console.error("Error updating admin password:", err);
        } else {
            console.log("Admin password updated successfully.");
        }
        db.close();
    });
});

Run the script file to hash the admin pass after inserting into DB

now  proceed with user insertion through the Regiter form in the web page

#setup one folder to store the documetns that user upload for scans

Project/Backend/public/uploads  - create these to folders to store the docs

6.API Endpoints:
#user register and login
1. user register POST - http://localhost:8000/api/auth/register
2. user login POST - http://localhost:8000/api/auth/login
3. user profile GET - http://localhost:8000/api/auth/profile (bsed on token)

#Documenst
1.Upload document POST - http://localhost:8000/api/documents/upload
2.Document matching GET - http://localhost:8000/api/documents/match/:{id} (document id)
3.Past scans GET - http://localhost:8000/api/documents/history (based on jwt token)

#Credits
1.request credits POST - http://localhost:8000/api/credits/request (jwt token)
2.Balance credits GET - http://localhost:8000/api/credits/balance (jwt token)
3.Approve or deny credits POST - http://localhost:8000/api/credits/process (admin only token)
4.Auto reset POST - http://localhost:8000/api/credits/reset

# admin 
1. Admin analytics GET - http://localhost:8000/api/admin/analytics (for admin purpose)

7.Sample datas -  test by running the web
# admin 
username - admin
password- admin123 

this credential will get into the admin portal(only this credentials will allow for admin portal its a default)

#users
1. Username = Vishnu Vardhan
   Password = vishnu
2.Usename = Athma Prakash
  password = athma

Start the server by running
noedmon index.js in the Backend directory 
you will get response as 
server is connected to 8000
connected to DB

and then go to web browser and search for 
http://localhost:8000/ -  it will get into the welcome page of this web app
   
    

 








