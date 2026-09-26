const argon2 = require("argon2");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { aesEncrypt, aesDecrypt } = require("../utils/crypto");

/**
 * Controller: Register a new user
 *
 * Handles POST requests to register a new user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - JSON object with success message and user information
 */
const register = async (req, res) => {
  try {
    //destructure the request body
    const { username, password, first_name, last_name, email } = req.body;

    if (!username || !password || !email || !first_name || !last_name) {
      return res.status(400).json({
        message:
          "username, password, first name, last name and email are required",
      });
    }

    //check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    //check if the email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    //hash the password
    const hashedPassword = await argon2.hash(password);

    //encrypt the email
    const encryptedEmail = aesEncrypt(
      email,
      process.env.EMAIL_ENCRYPTION_SECRET,
    );

    //encrypt the bio
    const encryptedBio = aesEncrypt(
      "You can edit your bio here",
      process.env.BIO_ENCRYPTION_SECRET,
    );
    //create a new user
    const newUser = new User({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      email: encryptedEmail.encryptedMessage,
      email_iv: encryptedEmail.iv,
      bio: encryptedBio.encryptedMessage,
      bio_iv: encryptedBio.iv,
    });
    //save the user to the database
    await newUser.save();

    //create tokens
    const accessToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );
    const refreshToken = jwt.sign(
      { id: newUser._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "24h" },
    );
    //create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Require https
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });
    //return the user
    res.status(201).json({
      message: `${username} created successfully`,
      accessToken,
      user: {
        id: newUser._id,
        role: newUser.role,
        username: newUser.username,
        email: aesDecrypt(
          newUser.email,
          process.env.EMAIL_ENCRYPTION_SECRET,
          newUser.email_iv,
        ),
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        bio: aesDecrypt(
          newUser.bio,
          process.env.BIO_ENCRYPTION_SECRET,
          newUser.bio_iv,
        ),
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * Controller: Login a user
 *
 * Handles POST requests to login a user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - JSON object with success message and user information
 */
const login = async (req, res) => {
  try {
    //destructure the request body
    const { username, password } = req.body;
    //check if the user exists
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    //check if the password is correct
    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }
    // create tokens
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );
    const refreshToken = jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "24h" },
    );
    //create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // Prevents JavaScript access
      secure: true, // Require https
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    });
    //return the access token
    res.status(200).json({
      message: "login successful",
      accessToken,
      user: {
        id: user._id,
        role: user.role,
        username: user.username,
        email: aesDecrypt(
          user.email,
          process.env.EMAIL_ENCRYPTION_SECRET,
          user.email_iv,
        ),
        first_name: user.first_name,
        last_name: user.last_name,
        bio: aesDecrypt(
          user.bio,
          process.env.BIO_ENCRYPTION_SECRET,
          user.bio_iv,
        ),
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Controller: Refresh the access token
 *
 * Handles GET requests to refresh the access token.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - JSON object with success message and user information
 */
const refresh = async (req, res) => {
  try {
    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(401).json({ message: "Unauthorized" });

    const refreshToken = cookies.jwt;

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    //create an access token
    const accessToken = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "10m" },
    );
    //return the access token
    res.status(200).json({
      message: "Token refreshed successfully",
      accessToken,
      user: {
        id: user._id,
        role: user.role,
        username: user.username,
        email: aesDecrypt(
          user.email,
          process.env.EMAIL_ENCRYPTION_SECRET,
          user.email_iv,
        ),
        first_name: user.first_name,
        last_name: user.last_name,
        bio: aesDecrypt(
          user.bio,
          process.env.BIO_ENCRYPTION_SECRET,
          user.bio_iv,
        ),
      },
    });
  } catch {
    return res.status(403).json({ message: "Forbidden" });
  }
};

/**
 * Controller: Logout a user
 *
 * Handles POST requests to logout a user.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - JSON object with success message
 */
const logout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content
  res.clearCookie("jwt", {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
  });
  res.status(200).json({ message: "Logged out successfully" });
};

/**
 * Controller: Modify a user's profile
 *
 * Handles PATCH requests to modify a user's profile.
 *
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {JSON} - JSON object with success message and user information
 */
const modifyProfile = async (req, res) => {
  const { id } = req.user;
  const { first_name, last_name, email, bio } = req.body;
  try {
    const user = await User.findById(id);
    if (!user) return res.status(401).json({ message: "Unauthorized" });
    user.first_name = first_name;
    user.last_name = last_name;
    //encrypt the email
    const encryptedEmail = aesEncrypt(
      email,
      process.env.EMAIL_ENCRYPTION_SECRET,
    );
    user.email = encryptedEmail.encryptedMessage;
    user.email_iv = encryptedEmail.iv;
    //encrypt the bio
    const encryptedBio = aesEncrypt(bio, process.env.BIO_ENCRYPTION_SECRET);
    user.bio = encryptedBio.encryptedMessage;
    user.bio_iv = encryptedBio.iv;
    await user.save();

    const responseUser = {
      username: user.username,
      email,
      first_name: user.first_name,
      last_name: user.last_name,
      bio,
    };

    res
      .status(200)
      .json({ message: "Profile modified successfully", user: responseUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  modifyProfile,
};
