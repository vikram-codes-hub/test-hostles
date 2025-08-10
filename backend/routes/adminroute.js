import express from "express";
const AdminRoute = express.Router();


import  adminauth  from "../middelwares/adminauth.js";
import { addHostel, edithostel, listHostels, removeHostel } from "../controller/admincontroller.js";
import upload from "../middelwares/multer.js";

//list hostels for admin
AdminRoute.get("/listhostels",adminauth,listHostels)

//add hostel for admin
AdminRoute.post(
  "/addhostel",
 adminauth,
  upload.fields([
    { name: "image1", maxCount: 1 },
    { name: "image2", maxCount: 1 },
    { name: "image3", maxCount: 1 },
    { name: "image4", maxCount: 1 },
  ]),
 addHostel
);

//remove hostel
AdminRoute.post('/remove',adminauth,removeHostel)

//Edit hostel
AdminRoute.put('/edithostel/:id',adminauth,upload.fields([
  { name: "image1", maxCount: 1 },
  { name: "image2", maxCount: 1 },
  { name: "image3", maxCount: 1 },
  { name: "image4", maxCount: 1 },
]),edithostel)


export default AdminRoute;