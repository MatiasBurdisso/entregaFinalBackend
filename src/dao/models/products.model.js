import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
    },
    carts: {
        type: [{
            cart: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "carts", 
            }
        },
    ],
    default: [],
    },
});

productsSchema.pre("findOne", function() {
    this.populate("carts.cart");
    
});

productsSchema.plugin(mongoosePaginate);

const productsModel = mongoose.model("products", productsSchema);

export default productsModel;