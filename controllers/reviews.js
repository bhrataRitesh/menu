const Item = require('../models/item')
const Review = require('../models/review')

module.exports.createReview = async (req, res) => {
    const item = await Item.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    item.reviews.push(review);
    await review.save()
    await item.save()
    req.flash('success', 'created new review');
    res.redirect(`/items/${item._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Item.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    // it just pull anything from id of review
    await Review.findByIdAndDelete(reviewId)
    req.flash('success', 'successfully deleted review');
    res.redirect(`/items/${id}`);
    // res.send("Delete ME")

}