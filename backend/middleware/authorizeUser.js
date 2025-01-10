const authorizeUser = (permittedRoles)=>{
    return (req,res,next)=>{
        if(permittedRoles.includes(req.currentUser.role)){
            next()
        }else{
            return res.status(403).json({errors : 'Unauthorized Access'})
        }
    }
}

export default authorizeUser