
import mongoose, {model, Schema, models} from "mongoose";

const ProductSchema = new Schema({
    tour: {type: mongoose.Types.ObjectId, ref: 'Product', required: true},
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true},
    rating: {type: Number, required: true, min: 1, max: 5},
    text: {type: String, required: true},
    createdAt: {type: Date, default: Date.now}
    }
);
export const Review= models.Review || model('Review', ProductSchema);