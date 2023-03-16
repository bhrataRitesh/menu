const { itemSchema, reviewSchema } = require('./schemas.js')
const ExpressError = require('./utils/ExpressError')
const Item = require('./models/item');
const Review = require('./models/review')
module.exports.isLoggedIn = (req, res, next) => {
    // console.log("Req user...", req.user);
    // console.log(req.path, req.originalUrl)
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'you must be signed in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateItem = (req, res, next) => {
    const { error } = itemSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }

}
module.exports.isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const item = await Item.findById(id);
    if (!item.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that ');
        return res.redirect(`/items/${id}`);
    }
    next();
}
module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You do not have permission to do that ');
        return res.redirect(`/items/${id}`);
    }
    next();
}