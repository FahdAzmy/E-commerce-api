const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const apiError = require("../utils/apierror");

exports.protectMiddlware = asyncHandler(async (req, res, next) => {
  const token = getTokenFromHeaders(req);
  if (!token)
    return next(
      new apiError(
        "you are not login,please Login to Get Access this route",
        401
      )
    );
  const decoded = verifyToken(token);
  const currentUser = await getUserById(decoded.userId);
  //3) check if user exist
  if (!currentUser) return next(new apiError("this user has no longer", 401));
  if (hasPasswordChanged(currentUser, decoded))
    return next(
      new apiError("User changed his Pasword .Please login agian", 401)
    );
  req.user = currentUser;
  next();
});

//1) check if token exist,if exsit  catched
function getTokenFromHeaders(req) {
  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader && authorizationHeader.startsWith("Bearer")) {
    return authorizationHeader.split(" ")[1];
  }
  return null;
}
//2)Verifey token (no change happens,expired Token)
function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
}
async function getUserById(userId) {
  return userModel.findById(userId);
}
//4) check if user change his password after token created
function hasPasswordChanged(user, decodedToken) {
  if (user.passwordchangedAt) {
    const passChangedTimestamps = parseInt(
      user.passwordchangedAt.getTime() / 1000,
      10
    );
    return passChangedTimestamps > decodedToken.iat;
  }
  return false;
}
