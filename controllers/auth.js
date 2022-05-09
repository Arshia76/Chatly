const UserSchema = require('../models/User');
const { comparePassword, hashPassword, jwtSign } = require('../utils/auth');

const LoginController = async (req, res) => {
  const body = req.body;

  try {
    const user = await UserSchema.findOne({ username: body.username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'کاربری با این نام‌کاربری وجود ندارد.',
      });
    }
    const isMatch = await comparePassword(body.password, user.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'نام کاربری یا رمز عبور اشتباه می‌باشد.',
      });
    }

    await user.save();

    const token = await jwtSign({ user });
    return res.status(200).json({
      id: user._id,
      username: user.username,
      token,
      avatar: user.avatar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

const RegisterController = async (req, res) => {
  const body = req.body;
  try {
    const existingEmail = await UserSchema.findOne({ email: body.email });
    const existingUsername = await UserSchema.findOne({
      username: body.username,
    });

    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'کاربری با این ایمیل وجود دارد',
      });
    }

    if (existingUsername) {
      return res.status(400).json({
        success: false,
        message: 'کاربری با این نام کاربری وجود دارد',
      });
    }

    const hashedPassword = await hashPassword(body.password);

    const user = new UserSchema({
      username: body.username,
      email: body.email,
      password: hashedPassword,
      avatar: body?.avatar ? body.avatar : null,
    });

    await user.save();

    const token = await jwtSign({ user });

    return res.status(200).json({
      id: user._id,
      username: user.username,
      token,
      avatar: user.avatar,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'خطای سرور',
      error,
    });
  }
};

module.exports = {
  RegisterController,
  LoginController,
};
