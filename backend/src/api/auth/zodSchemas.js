const { z } = require('zod');

const RegisterSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().optional(),
    password: z.string().min(6, { message: "Password must be at least 8 characters long" }),
    // age: z.number().int().min(1, { message: "Age must be a positive integer" }),
    // gender: z.enum(['Male', 'Female', 'Other'], { message: "Invalid gender" }),
    // height: z.number().positive({ message: "Height must be a positive number" }),
    // weight: z.number().positive({ message: "Weight must be a positive number" }),
    // mobileNumber: z.string().min(10, { message: "Invalid mobile number" }),
});

const LoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 8 characters long" }),
});

module.exports = { RegisterSchema, LoginSchema };