const yup = require('yup');

let loginSchema = yup.object({
  body: yup.object({
    username: yup.string().required('نام کاربری را وارد کنید'),
    password: yup.string().required('رمز عبور را وارد کنید'),
  }),
});

let registerSchema = yup.object({
  body: yup.object({
    username: yup.string().required('نام کاربری را وارد کنید'),
    email: yup
      .string()
      .email('ایمیل صحیحی را وارد کنید')
      .required('ایمیل را وارد کنید'),
    password: yup
      .string()
      .min(6, 'رمز عبور حداقل 6 کاراکتر می‌باشد')
      .required('رمز عبور را وارد کنید'),
    avatar: yup.string(),
  }),
});

module.exports = {
  loginSchema,
  registerSchema,
};
