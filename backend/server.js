import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import { connectDb }  from './config/db.js'

import userRouter from './routes/userroute.js'
import HostelRoute from './routes/HostelRoutes.js'
import LikeRoute from './routes/Likeroute.js'


const app=express()
const server=http.createServer(app)

connectDb()


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors())

app.get('/',(req,res)=>{
    res.send("API is working")
})
//routes
app.use('/api/auth',userRouter)
app.use('/api/hostel',HostelRoute)
app.use('/api/like',LikeRoute);

const PORT=process.env.PORT ||5000
server.listen(PORT,()=>console.log("Server is running on the port: "+PORT))