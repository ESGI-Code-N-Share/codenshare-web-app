import * as Yup from 'yup';


export const postTitleSchema = Yup.string().min(3).max(50);
export const postContentSchema = Yup.string().min(3).max(200);

