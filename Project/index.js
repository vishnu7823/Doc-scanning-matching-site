const express = require('express')
const app = express();
const dotenv = require('dotenv');
const cors = require('cors');
const db = require('./src/Config/db')
dotenv.config();
const routes = require('./src/routes/authRoutes')
const documentRoutes = require('./src/routes/documentRoutes');
const creditsRoutes = require('./src/routes/creditRoutes');
const cron = require('node-cron');
const {resetDailycredits} = require('./src/Controllers/creditController');
const path = require('path');
const adminRoutes =require('./src/routes/adminRoutes')


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); 

//routes


app.use('/api/auth',routes);
app.use('/api/documents',documentRoutes);
app.use('/api/credits',creditsRoutes);
app.use('/api/admin',adminRoutes);



app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname, './Frontend/index.html'));

})

//reset credits every midnight
cron.schedule("0 0 * * *", resetDailycredits);

app.use(express.static(path.join(__dirname, './Frontend')));
// app.use("/", express.static(path.join(__dirname, "../Frontend/index.html")));

app.listen(process.env.PORT,()=>{
    console.log(`server is connected to ${process.env.PORT}`);
})

