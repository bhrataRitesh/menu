const Item = require('../models/item')

const { cloudinary } = require('../cloudinary');

module.exports.index = async (req, res) => {
    const items = await Item.find({});
    res.render('items/index', { items })
}

module.exports.renderNewForm = (req, res) => {
    if (req.user.username == 'admin') {
        return res.render('items/new');
    } else {
        req.flash('error', 'You are not allowed to create New Items ')
        return res.redirect('/items');
    }
}
module.exports.createItem = async (req, res, next) => {
    const item = new Item(req.body.item);
    if (req.user.username == 'admin') {
        item.image = req.files.map(f => ({ url: f.path, filename: f.filename }));
        item.author = req.user._id;
        await item.save();
        console.log(item);
        req.flash('success', 'Successfully made a new item!');
        return res.redirect(`/items/${item._id}`)
    } else {
        req.flash('error', 'You are not allowed to create New Items')
        return res.redirect('/items');
    }

}

module.exports.showItem = async (req, res) => {
    const item = await Item.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');

    if (!item) {
        req.flash('error', 'Cannot find that Item!')
        return res.redirect('/items');
    }
    res.render('items/show', { item })
}

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const item = await Item.findById(id);


    if (!item) {
        req.flash('error', 'Cannot find that items!')
        return res.redirect('/items');
    }

    res.render('items/edit', { item })
}
module.exports.updateItem = async (req, res) => {


    const { id } = req.params;



    const item = await Item.findByIdAndUpdate(id, { ...req.body.item })
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    item.image.push(...imgs);
    await item.save()

    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await item.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
        console.log(item)
    }

    req.flash('success', 'Successfully updated');
    res.redirect(`/items/${item._id}`)
}
module.exports.deleteItem = async (req, res) => {
    const { id } = req.params;

    await Item.findByIdAndDelete(id);
    req.flash('success', 'successfully deleted Item');
    res.redirect('/items')
}