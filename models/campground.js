const mongoose = require('mongoose');
const { campgroundSchema } = require('../schemas');
const Schema = mongoose.Schema;
const Review = require('./review');

const CampgroundSchema = new Schema({
    title: String,
    image: String,
    price: Number,
    description: String,
    location: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]

});

// **Delete reviews associated with a deleted campground**

//  Query Middleware.  AFTER (.post) a campground is deleted:
// Feed the deleted document to the middleware (doc)
// If a document was found to be deleted: if(doc)
// Remove any reviews where the review ._id matches
// a review ._id in the deleted document.

CampgroundSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);