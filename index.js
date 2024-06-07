const express = require('express')
const userRouter = require('./Routes/userRoutes')
const jobRouter = require('./Routes/jobRoute')
const dbConnect = require('./Config/dbConnect')
const app = express()
const env = require('dotenv').config()
const cors = require("cors")
app.use(cors({origin : "*"}))


app.use(express.json({extended : true, limit : "50mb"}))
app.use('/api/user', userRouter)
app.use('/api/job', jobRouter)


const PORT = 5002
app.listen(PORT, ()=>{
    console.log(`App is running on http://localhost:${PORT}`);
})

dbConnect()