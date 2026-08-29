const validate = require("../middleware/validate");
const { body } = require("express-validator");
const User = require("../models/User");
const { aesEncrypt } = require("../utils/crypto");

const register = validate([
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .bail()
    .custom(async (username) => {
      const user = await User.findOne({ username });
      if (user) {
        return Promise.reject("Username already exists");
      }
    })
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false })
    .bail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {
        return Promise.reject("Email already exists");
      }
    }),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .escape(),
]);

const login = validate([
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .trim()
    .escape(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
]);

const modifyProfile = validate([
  body("first_name")
    .notEmpty()
    .withMessage("First name is required")
    .trim()
    .escape(),
  body("last_name")
    .notEmpty()
    .withMessage("Last name is required")
    .trim()
    .escape(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email")
    .normalizeEmail({ gmail_remove_dots: false, gmail_remove_subaddress: false })
    .bail()
    .custom(async (email, { req }) => {
      //get the id from the req
      const { id } = req.user;

      //get the user from the database
      const user = await User.findById(id);

      //get the email_iv from the database
      const { email_iv } = user;

      //encrypt the user's email
      const userEncryptedEmail = aesEncrypt(
        email,
        process.env.EMAIL_ENCRYPTION_SECRET,
        email_iv,
      );

      //check if the user's email is the same as the email in the request
      const sameEmailUser = await User.findOne({
        email: userEncryptedEmail.encryptedMessage,
        _id: { $ne: id },
      });
      if (sameEmailUser) {
        return Promise.reject("Email already exists");
      }
    }),
  body("bio")
    .optional()
    .isString()
    .withMessage("Bio must be a string")
    .trim()
    .escape(),
]);

module.exports = {
  register,
  login,
  modifyProfile,
};
