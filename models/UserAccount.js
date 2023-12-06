import {model, models, Schema} from "mongoose";

const UserAccountSchema = new Schema({
    userEmail: {type:String, unique:true, required:true},
    name: String,
    email:String,
    gender: String,
    phoneNumber: String,
    pickUpAddress: String,

});

export const UserAccount = models?.UserAccount || model('UserAccount', UserAccountSchema);