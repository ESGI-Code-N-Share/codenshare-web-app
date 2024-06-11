import * as Yup from 'yup';


export const programNameSchema = Yup
    .string()
    .trim()
    .min(3, 'form.program_name.min')
    .max(50, 'form.program_name.max');
export const programDescriptionSchema = Yup
    .string()
    .trim()
    .min(3, "form.program_description.min")
    .max(200, "form.program_description.max");
export const programLanguageSchema = Yup
    .string()
    .trim()
    .lowercase()
    .min(1, 'form.program_language.min')
    .max(50, 'form.program_language.max');

export const programCreateSchema = Yup.object().shape({
    name: programNameSchema.required(),
    description: programDescriptionSchema.required(),
    language: programLanguageSchema.required(),
});

export const programUpdateSchema = Yup.object().shape({
    name: programNameSchema,
    description: programDescriptionSchema,
    language: programLanguageSchema,
});





