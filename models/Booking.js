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

    childrenCount: {
        type: Number,
        required: [true, 'Please specify the number of children.'],
        min: [0, 'Number of children cannot be negative.']
    },
    childrenAges: {
        type: [Number], // Array of numbers to store the ages of each child
    },

}, {
    timestamps: true,
});

export const Booking = models?.Booking || model('Booking', BookingSchema);