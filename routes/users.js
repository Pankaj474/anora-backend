var express = require('express');
var router = express.Router();
const cors = require('./cors');
const User = require("../controllers/user");
const authenticate = require('../authenticate');

const userCtrl = require('../controllers/user');
const fileUpload = require('express-fileupload');

router.use(express.json());


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', (req, res) => {
  res.render('login', { title: "Login" });
});

router.get('/forgot_password', (req, res) => {
  res.render('forgot_password', { title: "Forgot Password" });
});

router.get('/reset_password', (req, res) => {
  res.render('reset_password', { title: "Reset Password" });
});

router.get('/account_verification', (req, res) => {
  res.render('account_verification', { title: "Account Verification" });
});

// Logout
router.get("/logout", function (req, res) {
  req.logout();
  res.redirect("/login");
});


router.options('/signup', cors.corsWithOptions);
router.post('/signup', cors.corsWithOptions, userCtrl.signup);


router.options('/login', cors.corsWithOptions);
router.post('/login', cors.corsWithOptions, userCtrl.loginCustomUser);

// router.options('/invite-affiliate', cors.corsWithOptions);
router.post('/invite-affiliate', userCtrl.inviteAffiliateUser);

router.options('/invite-affiliate', cors.corsWithOptions);
router.post('/invite-affiliate', cors.corsWithOptions, userCtrl.inviteAffiliateUser);

router.options('/forgot_password', cors.corsWithOptions);
router.post('/forgot_password', cors.corsWithOptions, userCtrl.forgotPassword);

router.options('/change_password', cors.corsWithOptions);
router.post('/change_password', cors.corsWithOptions, authenticate.verifyUser, userCtrl.resetPassword);
router.options('/reset_password', cors.corsWithOptions);
router.post('/reset_password', cors.corsWithOptions, authenticate.verifyUser, userCtrl.resetPassword);

router.options('/account_verification', cors.corsWithOptions);
router.post('/account_verification', cors.corsWithOptions, authenticate.verifyUser, userCtrl.verifyAccount);

router.options('/affiliate_details', cors.corsWithOptions);
router.post('/affiliate_details/', cors.corsWithOptions, authenticate.verifyUser, fileUpload({
  createParentPath: true
}), userCtrl.setAffiliateDetails);
// router.get('/affiliate_details/:uniqueurl',cors.corsWithOptions, userCtrl.getAffiliateDetails);


router.post("/update-user", authenticate.verifyUser, User.update);
router.post("/set-affiliate", User.setAffiliate);
router.get("/retrieve-users", User.getUsers);
router.post("/delete-user", User.delete);

router.get("/fetch-profile", authenticate.verifyUser,userCtrl.fetchProfile);

module.exports = router;
