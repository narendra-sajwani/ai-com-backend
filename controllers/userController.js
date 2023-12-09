const getCurrentTime = require("../utils/getTime");
const data = {};
data.user = require("../models/data.json");

const getUserProfile = (req, res) => {
  const id = parseInt(req.params.id);
  const found = data.user.find((user) => user.id === id);

  if (found) {
    res.status(200).json(found);
  } else {
    res.status(404).send("could not find user");
  }
};

const getUserScore = (req, res) => {
  const id = parseInt(req.params.id);
  const found = data.user.find((user) => user.id === id);
  if (found) {
    res.status(200).send(`User ${id} has score of ${found.score}`);
  } else {
    res.status(404).send("could not find user");
  }
};

module.exports = { getUserProfile, getUserScore };
