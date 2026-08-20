



async function registerController(req,res)
{
    const {username,email,password} = req.body
    if(!username)
    {
        return res.status(401).json({
            message:"Username is required"
        })
    }

}


export {
    registerController
}