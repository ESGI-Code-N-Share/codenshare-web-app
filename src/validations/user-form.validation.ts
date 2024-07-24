import * as Yup from "yup";

export const firstnameSchema = Yup
    .string()
    .trim()
    .lowercase()
    .min(3, "form.firstname.required")
    .max(50, "form.firstname.invalid");
export const lastnameSchema = Yup
    .string()
    .trim()
    .lowercase()
    .min(3, "form.lastname.min")
    .max(50, "form.lastname.max");
export const birthdateSchema = Yup
    .date()
    .max(new Date(new Date().getFullYear() - 18, 0, 1), "form.birthdate.max");
export const emailSchema = Yup
    .string()
    .trim()
    .lowercase()
    .email("form.email.invalid");
export const passwordSchema = Yup
    .string()
    .trim()
    .min(6, "form.password.min")
    .max(20, "form.password.max");
export const cguSchema = Yup.boolean().oneOf([true]);


export const userLoginSchema = Yup.object().shape({
    email: emailSchema.required("form.email.required"),
    password: passwordSchema.required("form.password.required"),
});

export const userCreateSchema = Yup.object().shape({
    firstname: firstnameSchema.required("form.firstname.required"),
    lastname: lastnameSchema.required("form.lastname.required"),
    birthdate: birthdateSchema.required("form.birthdate.required"),
    email: emailSchema.required("form.email.required"),
    password: passwordSchema.required("form.password.required"),
    cgu: cguSchema.required("form.cgu.required"),
});

export const userUpdateSchema = Yup.object().shape({
    firstname: firstnameSchema.required("form.firstname.required"),
    lastname: lastnameSchema.required("form.lastname.required"),
    birthdate: birthdateSchema.required("form.birthdate.required"),
});