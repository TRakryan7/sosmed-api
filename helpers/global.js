import jwtDecode from "jwt-decode";
import sessionStorage from "sessionstorage-for-nodejs";


// function auth(req,res)


export const currentUser = (async(req,res)=>{
    const idUser = req.header.token;

    if(!idUser){
        return null
    }

    const id = jwtDecode(req.header.token).userId;

    return id;
})

