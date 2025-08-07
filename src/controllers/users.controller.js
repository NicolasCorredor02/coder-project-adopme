import { usersService } from "../services/index.js";
import { CustomError } from "../utils/CustomError.js";

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) {
        CustomError.userError('NOT_FOUND')
    }
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) {
        CustomError.userError('NOT_FOUND');
    }
    const result = await usersService.update(userId,updateBody);
    if (!result) {
        CustomError.userError('UPDATE_FAILED')
    }

    res.send({status:"success",message:"User updated", data: result})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);

    if (!result) {
        CustomError.userError('NOT_FOUND')
    }
    
    res.send({status:"success",message:"User deleted"})
}

export default {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser
}