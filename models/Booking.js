import {model, models, Schema} from "mongoose";

const BookingSchema = new Schema({
    line_items:Object,
    name:String,
    gender:String,
    email:String,
    phoneNumber:String,
    pickUpAddress:String,
    paid:Boolean,
});

export const Booking = models?.Booking || model('Booking', BookingSchema);