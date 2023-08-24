// import {expressjwt} from 'express-jwt';

import  Jwt  from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config({path:'.env'});
const config = process.env.SECRET;

const auth = (req, res, next) => {
    const token =
      req.body.token || req.query.token || req.headers["authorization"];
  
  // console.log(token);
  
    if (!token) {
      return res.status(403).send("A token is required for authentication");
    }
    try {
      const decoded = Jwt.verify(token.split(' ')[1], config);
      req.user = decoded;
    } catch (err) {
      return res.status(401).send(err);

      // if (err.name === 'TokenExpiredError') {
      //   return res.status(401).send({message:'failed', status:'expired'});
      // } else {
      //   return res.status(401).send(err);
      // }
      
    }
    return next();
  };



// function auth(req,res,next){

//     //  const authToken = req?.header.authorization;


//     // console.log(authToken);
//     const secret = process.env.SECRET;

//    return expressjwt({
//         secret,
//         algorithms:['HS256'], 
//         isRevoked: isRevoked(),
//         // getToken:fromHeaderOrQuery(req)
//         // getToken: function fromHeaderOrQuery(req){
//         //     // console.log(req);
//         //     if(
//         //         req.headers.authorization && 
//         //         req.headers.authorization.split(" ")[0] === 'Bearer'    
//         //     ){
//         //         // console.log("it's Running");
//         //         return req.headers.authorization.split(" ")[1];
//         //     }
//         // }
//     }).unless({
//         path:[
//             '/api/user/login',
//             '/api/user/register']
//     })


    

// }

// async function isRevoked(req,playload,done){
//     if(!playload?.isAdmin){
//          return true
//     }

//     return false
// }

//  async function fromHeaderOrQuery(req){
//         // console.log(req);
//         if(
//             req?.headers.authorization && 
//             req?.headers.authorization.split(" ")[0] === 'Bearer'    
//         ){
//             // console.log("it's Running");
//             return req?.headers.authorization.split(" ")[1];
//         }
//     }

// async function getHeader(req){
//     if (
//         req?.headers.authorization &&
//         req?.headers.authorization.split(" ")[0] === 'Bearer'
//     ){
//         return req?.headers.authorization.split(' ')[1];
//     }else if (req?.query && req?.query.token){
//         return req?.query.token;
//     }
//     return null
// }

export default auth