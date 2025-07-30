const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')

const { isLoggedIn, isAuthor, validateItem } = require('../middleware');
const items = require('../controllers/items');

const multer = require('multer');
const { storage } = require('../cloudinary')

const upload = multer({ storage });

//fancy way to restructure
router.route('/')  //code 01
    .get(catchAsync(items.index))
    .post(isLoggedIn, upload.array('image'), validateItem, catchAsync(items.createItem))
    // .post(upload.single('image'), (req, res) => {
    //     console.log(req.body, req.file);

    //     res.send('It worked!')
    // })
//or
// router.get('/', catchAsync(campgrounds.index)) //code 01
router.get('/new', isLoggedIn, items.renderNewForm)
// router.post('/', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground)) //code 01

router.route('/:id')  //code 02
    .get(catchAsync(items.showItem))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateItem, catchAsync(items.updateItem))
    .delete(isLoggedIn, isAuthor, catchAsync(items.deleteItem))

// router.get('/:id', catchAsync(campgrounds.showCampground));   //code 02

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(items.renderEditForm))

// router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(campgrounds. updateCampground))  //code 02

// router.delete('/:id', isLoggedIn, isAuthor, catchAsync(campgrounds.deleteCampground)) //code 02

module.exports = router;