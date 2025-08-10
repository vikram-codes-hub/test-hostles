import jwt from 'jsonwebtoken';

const adminauth = async (req, res, next) => {
  try {
   
    const token = req.headers.token || req.headers.authorization;
    
    if (!token) {
      return res.json({ success: false, mssg: "Not authorized. Login again." });
    }

    const decode_token = jwt.verify(token, process.env.JWT_SECRET);
    
    //  Check if the token has role=admin
    if (decode_token.role !== "admin") {
      return res.json({ success: false, mssg: "Admin access denied." });
    }
    
    req.user = decode_token;
    next(); 
    
  } catch (error) {
    console.log(error);
    res.json({ success: false, mssg: error.message });
  }
};

export default adminauth;