import { body, validationResult } from 'express-validator'

/* ================= EMAIL REGEX ================= */

const emailRegex =
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;

/* ================= PASSWORD REGEX ================= */
/*
Rules:
- Minimum 8 characters
- At least 1 uppercase
- At least 1 lowercase
- At least 1 number
- At least 1 special character
*/

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


export const validate = (err, req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const err = new Error(errors.array()[0].msg);
        err.status = 400;
        return next(err);
    }
    next();
}


export const registerValidator = [
    body("username")
        .trim()
        .notEmpty().withMessage("user name is required")
        .isLength({ min: 3 }).withMessage("username must be atleast 3 character"),

    body("password")
        .trim()
        .notEmpty().withMessage("password is required")
        .matches(passwordRegex)
        .withMessage("Password must be 8+ chars, include uppercase, lowercase, number & special character"),

    body("email")
        .trim()
        .notEmpty().withMessage("email is required")
        .matches(emailRegex)
        .withMessage("Please enter a valid email"),

    validate
];

export const loginValidation = [

    body("email")
        .optional()
        .trim()
        .matches(emailRegex)
        .withMessage("Invalid Email Format"),

    body("username")
        .optional()
        .trim(),

    body("password")
        .notEmpty()
        .withMessage("Password is required"),

    validate
];


