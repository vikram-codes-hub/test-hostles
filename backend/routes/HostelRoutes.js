import express from "express";
const HostelRoute = express.Router();

import upload from "../middelwares/multer.js";
import  adminauth  from "../middelwares/adminauth.js";
import { addHostel, listHostels, removeHostel, Singelhostelinfo } from "../controller/ProductController.js";

HostelRoute.post(
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
HostelRoute.post('/remove',adminauth,removeHostel)
HostelRoute.get("/listhostels",listHostels)
HostelRoute.get("/singelhostelinfo",Singelhostelinfo)

export default HostelRoute