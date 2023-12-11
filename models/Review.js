
import {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
    product: {type: Schema.Types.ObjectId, required: true},
    // user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    stars: {type: Number, required: true, min: 1, max: 5},
    title: {type: String, required: true},
    desc:{type: String,}
    },{timestamps:true}
);
export const Review= models.Review || model('Review', ProductSchema);