const { searchUserByEmail, addFriend } = require("../services/friendsService");
const { parseJwt } = require("../utils/jwtUtils");

const handleSearchFriend = async (req, res) => {
 
const fullUrl = new URL(req.url, `http://${req.headers.host}`);
const email = fullUrl.searchParams.get('email');

  if (!email) {
    res.writeHead(400, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Email query parameter is required." }));
    return;
  }

  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    res.writeHead(401, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Authorization token is required." }));
    return;
  }

  try {
    const user = parseJwt(token);
    if (!user) {
      res.writeHead(401, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid token." }));
      return;
    }

    const friend = await searchUserByEmail(email);
    if (!friend) {
      alert("Friend not found.");
      res.writeHead(404, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Friend not found." }));
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(friend));
    }
  } catch (error) {
    console.error("Error searching for friend:", error);
    res.writeHead(500, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ error: "Internal server error." }));
  }
};

async function handleAddFriend(request, response) {
  try {
    const { userEmail, friendEmail } = request.body;
    const result = await addFriend(userEmail, friendEmail);
    response.writeHead(200, { "Content-Type": "application/json" });
    response.end(JSON.stringify(result));
  } catch (error) {
    response.writeHead(500, { "Content-Type": "application/json" });
    response.end(JSON.stringify({ error: "Failed to add friend." }));
  }
};

module.exports = {
  handleSearchFriend,
  handleAddFriend
};