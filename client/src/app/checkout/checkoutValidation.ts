import * as yup from 'yup'

export const validationSchema=[yup.object({
    fullName:yup.string().required("Full name is a required field!"),
    address1:yup.string().required("Address line 1 is a required field!"),
    address2:yup.string().required("Address line 2 is a required field!"),
    city:yup.string().required(),
    state:yup.string().required(),
    zip:yup.string().required(),
    country:yup.string().required(),
}),yup.object(),
yup.object({
    nameOnCard:yup.string().required()
})]