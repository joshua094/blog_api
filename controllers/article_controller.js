const user = require('./models/user')

async function checkOwner (req,res,next) {
    if (req.user == null) {
        res.status(403)
        res.send('You need to be a user')
    }
    if (req.user.role)
}