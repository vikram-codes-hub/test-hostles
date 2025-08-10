import express from "express";
const HostelRoute = express.Router();

import upload from "../middelwares/multer.js";
import  adminauth  from "../middelwares/adminauth.js";
import {  listHostels, Singelhostelinfo } from "../controller/ProductController.js";



HostelRoute.get("/listhostels",listHostels)
HostelRoute.get("/singelhostelinfo/:id",Singelhostelinfo)


export default HostelRoute