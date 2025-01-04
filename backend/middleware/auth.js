import jwt from "jsonwebtoken"
const auth = async(req,res,next)=>{
    const headers = req.headers["authorization"]
    if(!headers){
        return res.status(404).json({error:"Token field is empty"})
    }
    try {
        const tokenData = jwt.verify(headers,process.env.SECRET_KEY)
        if(!tokenData){
            return res.status(404).json({error:"Token field is empty"})
        }
        req.currentUser = { id: tokenData.id, role: tokenData.role };
        next()
    } catch (err) {
        res.status(500).json({error:"Error while verifying the token"})
    }
}
export default auth