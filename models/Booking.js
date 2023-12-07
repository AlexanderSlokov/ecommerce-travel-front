import {model, models, Schema} from "mongoose";

const BookingSchema = new Schema({
    userEmail: String,
    line_items:Object,
    name:String,
    gender:String,
    email:String,
    phoneNumber:String,
    pickUpAddress:String,
    paid:Boolean,
}, {
    timestamps: true,
});

export const Booking = models?.Booking || model('Booking', BookingSchema);