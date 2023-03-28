const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
  uploadUserPhoto,
  resizeUserPhoto,
} = require('../controllers/userController');

const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post(
  '/forgotPassword',
  authController.forgotPassword
);
router.patch(
  '/resetPassword/:token',
  authController.resetPassword
);

router.use(authController.protect);

router.patch(
  '/updateMyPassword',
  authController.updatePassword
);
router.get('/me', getMe, getUser);
router.patch(
  '/updateMe',
  uploadUserPhoto,
  resizeUserPhoto,
  updateMe
);
router.delete('/deleteMe', deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

module.exports = router;
