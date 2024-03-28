const express = require('express')
const cors = require('cors')
require('dotenv').config();
const {PORT}=require('./src/config/config')
const routerUser = require('./src/routes/user.routes')
const connectDb = require('./src/db/db');
const emailRoutes = require('./src/routes/email.routes');
const tokenRoutes = require('./src/routes/token.routes');
const studentRoutes = require('./src/routes/student.routes')
const jobRoutes = require('./src/routes/job.routes')
const applicationRoutes = require('./src/routes/application.routes')
const app = express()
//cors
app.use(cors())
app.use(express.json())
//connectDB
connectDb()


//middleware

//routes
app.use('/api',routerUser)
app.use('/api',applicationRoutes)
app.use('/api',studentRoutes)
app.use('/api',jobRoutes)
app.use('/api',emailRoutes)
app.use('/api',tokenRoutes)
// app.get("/",async (req, res) => {
//   const feedback = await feedbacks.find({}) 
//   res.json(feedback);
// });


app.listen(PORT, () => console.log(`Server runing at PORT ${PORT}`));
