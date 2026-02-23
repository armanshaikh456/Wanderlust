const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

// async function main() {
//     await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
// }

// main()
//     .then((res) => console.log("connected to DB"))
//     .catch(e => console.log(e));

const listingSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: String
    },
    price: Number,
    location: String,
    country: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

    geometry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
   
  category : {
    type: String,
    required: true,
    enum: ["trending", "rooms", "iconic cities", "mountains", "castles", "amazing pools", "camping", "arctic", "farms", "domes", "boats"]
  }
}
);

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({_id: {$in: listing.reviews}});
    };
});

let Listing = mongoose.model("Listing", listingSchema)

module.exports = Listing;