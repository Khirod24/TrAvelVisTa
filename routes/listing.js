const express= require("express");
const router = express.Router();
const wrapAsync= require("../utils/wrapAsync.js");
const Listing= require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingController = require("../controllers/listings.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({storage})

router
.route("/")
.get(wrapAsync(listingController.index))
.post(isLoggedIn,validateListing,upload.single("listing[image]"),
    wrapAsync(listingController.createListing)
);

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

router.
route("/:id")
.get(wrapAsync(listingController.showListing))
.put(isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

//INDEX ROUTE
// router.get("/",wrapAsync(listingController.index));

//SHOW ROUTE
// router.get("/:id",wrapAsync(listingController.showListing));

//CREATE ROUTE
// router.post("/",isLoggedIn,validateListing,
//     wrapAsync(listingController.createListing)
// )

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//UPDATE ROUTE
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

//DELETE ROUTE
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))

module.exports = router;