import express from 'express'
import 'dotenv/config'
import cors from 'cors'
import http from 'http'
import { connectDb }  from './config/db.js'
import {Server} from 'socket.io'

//Routes for the application
import userRouter from './routes/userroute.js'
import HostelRoute from './routes/HostelRoutes.js'
import LikeRoute from './routes/Likeroute.js'
import MessageRoute from './routes/Messageroute.js'
import AdminRoute from './routes/adminroute.js'
import roommaterfinder from './routes/Roommate.js'


const app=express()
const server=http.createServer(app)

connectDb()


app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(cors())

//socket.io setup
export const io = new Server(server, {
  cors: { origin: "*" }
});
// Store mapping of userId => socketId
export const UserSocketMap = {}; 

// Socket.io connection handler
io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;

  if (!userId) {
    console.log("No userId provided in handshake");
    return;
  }
    console.log("User connected:", userId);

  // Save user to the socket map
  UserSocketMap[userId] = socket.id;
   // Emit all online user IDs to all clients
  io.emit("getOnlineUsers", Object.keys(UserSocketMap));

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", userId);
    delete UserSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(UserSocketMap));
  });

    // Optional: Message relay support
  socket.on("sendMessage", ({ senderId, receiverId, message }) => {
    const receiverSocketId = UserSocketMap[receiverId];
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", {
        senderId,
        message,
      });
    }
  });
});

app.get('/',(req,res)=>{
    res.send("API is working")
})
//routes
//user routes
app.use('/api/auth',userRouter)
//admin route
app.use('/api/admin',AdminRoute)
//hostel routes
app.use('/api/hostel',HostelRoute)
//saved hostel routes
app.use('/api/likes',LikeRoute);
//message routes
app.use('/api/message',MessageRoute)
//roommate routes
app.use('/api/roommate',roommaterfinder)



const PORT=process.env.PORT ||5000
server.listen(PORT,()=>console.log("Server is running on the port: "+PORT))