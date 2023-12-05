var express = require('express');
var router = express.Router();
const cors = require('./cors');
const smartMoneyManagementCtrl = require('../controllers/smart_money_management');
const authenticate = require('../authenticate');

const userCtrl = require('../controllers/user');

router.use(express.json());

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/user', userCtrl.createUser);
router.get('/user', userCtrl.getUserList);
router.get('/user/:id', userCtrl.getUserById);
router.put('/user', userCtrl.userUpdate);
router.delete('/user', userCtrl.deleteUser);
// router.get('/login', (req, res) => {
//   res.render('login', {title: "Login"});
// });

router.post('/smart_money_management', smartMoneyManagementCtrl.create);
router.get(
  '/smart_money_management/address/:address',
  smartMoneyManagementCtrl.getNameByAddress
);
router.get('/smart_money_management/:id', smartMoneyManagementCtrl.get);

router.get('/smart_money_management', smartMoneyManagementCtrl.getAll);
router.put('/smart_money_management', smartMoneyManagementCtrl.update);
router.delete('/smart_money_management', smartMoneyManagementCtrl.delete);

router.options('/login', cors.corsWithOptions);
router.post('/login', cors.corsWithOptions, userCtrl.loginAdminUser);

// router.options('/change_password', cors.corsWithOptions);
// router.post('/change_password', cors.corsWithOptions, authenticate.verifyUser, userCtrl.resetPassword);
// router.options('/reset_password', cors.corsWithOptions);
// router.post('/reset_password', cors.corsWithOptions, authenticate.verifyUser, userCtrl.resetPassword);

// router.options('/account_verification', cors.corsWithOptions);
// router.post('/account_verification', cors.corsWithOptions, authenticate.verifyUser, userCtrl.verifyAccount);

router.post('/set-affiliate', userCtrl.setAffiliate);
router.get('/retrieve-users', userCtrl.getUsers);

module.exports = router;
