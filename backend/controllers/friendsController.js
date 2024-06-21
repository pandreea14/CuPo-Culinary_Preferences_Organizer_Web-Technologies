const { searchUserByEmail } = require("../services/friendsService");

const handleSearchFriend = async (request, response) => {
  try {
    const { friendEmail } = request.body;

    const user = await searchUserByEmail(friendEmail);

    if (user.error) {
      response.status(404).json({ error: user.error });
      return;
    }

  } catch (error) {
    console.error("Error searching friend:", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  handleSearchFriend,
};
