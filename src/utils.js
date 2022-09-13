const jwt = require("jsonwebtoken");
const APP_SECRET = "HELLO:GRAPHQL";

function getTokenPayload(token) {
    console.log('En getTokenPayload');
    console.log('token', token);
    console.log('APP_SECRET', APP_SECRET);
  return jwt.verify(token, APP_SECRET);
}

function getUserId(req, authToken) {
    console.log('En el getUserId');
  if (req) {
    const authHeader = req.headers.authorization;
    console.log('authHeader',authHeader);
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      if (!token) {
        throw new Error("Not token found");
      }
      const { userId } = getTokenPayload(token);
      return userId;
    }
  } else if (authToken) {
    const { userId } = getTokenPayload(authToken);
    return userId;
  }
  throw new Error("Not authenticated");
}

module.exports = {
    APP_SECRET,
    getUserId,
}
