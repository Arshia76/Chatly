const yup = require('yup');

let updateUserSchema = yup.object({
  body: yup.object({
    username: yup.string().required('نام کاربری نمی‌تواند خالی باشد'),
    email: yup
      .string()
      .required('ایمیل نمی‌تواند خالی باشد.')
      .email('ایمیل صحیحی را وارد نمایید.'),
  }),
});

let updatePasswordSchema = yup.object({
  body: yup.object({
    password: yup.string().required('رمز عبور خود را وارد کنید'),
    newPassword: yup.string().required('رمز عبور جدید خود را وارد کنید'),
  }),
});

module.exports = {
  updateUserSchema,
  updatePasswordSchema,
};
