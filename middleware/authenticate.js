const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET; // Same secret used in generating token

// Middleware function to authenticate JWT token
const authenticateToken = (req, res, next) => {
  // Get the token from the request headers
  const authHeader = req.headers['authorization']

  // The token is usually sent as 'Bearer <token>'
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' })
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' })
    }

    // If token is valid, save user info in request object and continue
    req.user = decoded; // `decoded` contains the user data embedded in the token (e.g., user ID)
    next()
  })
}

module.exports = {authenticateToken};


// const protectedRoutes = async (req, res, next)=>{

//     const token = req.cookies.jwt;
//     // check json web token exists and is valid
//     if(token){
//         jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken)=>{
//             if(error){
//                 //console.log(error.message);
//                 return res.status(400).json({message: 'Access denied. Invalid or expired token'})
//             }else{
//                 console.log(decodedToken);
//                 next();
//             }
//         })
//     }else{
//         //console.log(err.message);
//         return res.status(400).json({message: 'Access denied. Token is required'})
//     }
// }
// module.exports = {protectedRoutes}