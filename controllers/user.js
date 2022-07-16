const UserModel = require('../models/User');
const { comparePassword, hashPassword } = require('../utils/auth');
const { deleteFile, createDirectory } = require('../utils/functions');

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

const updateUserController = async (req, res) => {
  const id = req.params.userId;
  const body = req.body;
  try {
    const user = await UserModel.findById(id);

    const existingUserName = await UserModel.findOne({
      username: body.username,
    });
    if (existingUserName && user.username !== body.username) {
      return res.status(400).json({
        success: false,
        message: 'کاربری با این نام کاربری موجود می‌باشد.',
      });
    }
    user.username = body.username;

    const existingEmail = await UserModel.findOne({
      email: body.email,
    });
    if (existingEmail && user.email !== body.email) {
      return res.status(400).json({
        success: false,
        message: 'کاربری با این ایمیل موجود می‌باشد.',
      });
    }
    user.email = body.email;

    await user.save();

    return res.status(201).json({
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: 'خطای سرور',
    });
  }
};

const updateUserAvatarController = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.userId);
    if (req.files) {
      console.log(req.files);
      console.log(req.body);
      let file = req.files.file;
      let filename = Date.now() + file.name;
      console.log(filename);

      const path = `${require('path').resolve(
        __dirname,
        '..'
      )}/uploads/avatars/${req.body.user}`;

      createDirectory(path);

      file.mv(`${path}/${filename}`, async function (err) {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'خطا در بارگزاری',
            error: err,
          });
        } else {
          console.log('File Uploaded');
          if (user.avatar) {
            deleteFile(
              `${require('path').resolve(__dirname, '..')}${user.avatar}`
            );
          }
          const dataPath = `/uploads/avatars/${req.body.user}` + '/' + filename;
          user.avatar = dataPath;
          await user.save();
          return res.status(201).json({
            id: user._id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
          });
        }
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: 'خطای سرور',
    });
  }
};

const changePasswordController = async (req, res) => {
  try {
    const body = req.body;
    const id = req.params.userId;

    const user = await UserModel.findById(id);

    const isMatch = await comparePassword(body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'رمز عبور اشتباه می‌باشد.',
      });
    }
    user.password = await hashPassword(body.newPassword);
    await user.save();
    return res.status(201).json({
      success: true,
      message: 'رمز با موفقیت تغییر یافت.',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error,
      message: 'خطای سرور',
    });
  }
};

module.exports = {
  searchUser,
  updateUserController,
  updateUserAvatarController,
  changePasswordController,
};
