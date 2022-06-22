const UserModel = require('../models/User');

const searchUser = async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { username: { $regex: req.query.search, $options: 'i' } },
          { email: { $regex: req.query.search, $options: 'i' } },
        ],
      }
    : {};

  if (Object.keys(keyword).length > 0) {
    const users = await UserModel.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    return res.status(200).json(users);
  } else {
    return res.status(200).json([]);
  }
};

module.exports = {
  searchUser,
};
