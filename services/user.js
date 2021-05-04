const User = require("../models/User")


const getUserById =(id) => {
    return User.findOne({_id : id}).select('-password')
}


const getAllConditionalUsers =(condition) => {
    return User.find(condition).select('-password')
}


const getAllUsers =() => {
    return User.find().select('-password')
}





module.exports = {getUserById,getAllConditionalUsers,getAllUsers}