import React, { useState } from "react";
import { Label } from "../../UIs/shadcn-ui/label";
import { Input } from "../../UIs/shadcn-ui/input";
import { cn } from "../../UIs/utils/cn";
import { Link, useNavigate } from "react-router-dom";
import Global from "../../Utils/Global";
import { toast } from "sonner";
import { CgGoogle } from "react-icons/cg";
import zxcvbn from "zxcvbn";


export function Signup() {
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
    const [passwordStrength, setPasswordStrength] = useState(-1); // Updated initial state to -1
    const navigate = useNavigate();

    const validateForm = (firstName, lastName, email, password, confirmPassword) => {
        const newErrors = { firstName: "", lastName: "", email: "", password: "", confirmPassword: "" };
        if (!firstName) newErrors.firstName = "First name is required";
        if (!lastName) newErrors.lastName = "Last name is required";
        if (!email) newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
        if (!password) newErrors.password = "Password is required";
        if (!confirmPassword) newErrors.confirmPassword = "Confirm Password is required";
        if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
        return newErrors;
    };

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        const result = password ? zxcvbn(password) : { score: -1 }; // Set score to -1 if password is empty
        setPasswordStrength(result.score);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { firstName, lastName, email, password, confirmPassword } = e.target.elements;

        const newErrors = validateForm(firstName.value, lastName.value, email.value, password.value, confirmPassword.value);
        setErrors(newErrors);
        if (Object.values(newErrors).some(error => error)) {
            return;
        }

        setIsLoading(true); // Set loading state to true during HTTP request

        try {
            await Global.httpPost('/auth/register', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value
            });
            toast.success('Account created successfully');
            navigate("/login");
        } catch (err) {
            toast.error(err.message);
            console.error(err.message);
        } finally {
            setIsLoading(false); 
        }
    };
    const handleGoogleButton = async () => {
        setIsLoading(true); // Set loading state to true during HTTP request
        try {
            window.location.href = `${import.meta.env.VITE_BACKEND_SERVER_URL}/auth/google/admin`;
        } catch (err) {
            console.error(err);
            // Handle error, show error message, etc.
        } finally {
            setIsLoading(false); // Reset loading state after HTTP request completes
        }
    }

    const getPasswordStrengthColor = (score) => {
        switch (score) {
            case 0:
                return "bg-red-700";
            case 1:
                return "bg-[#f08c00]";
            case 2:
                return "bg-[#f08c00]";
            case 3:
                return "bg-blue-700";
            case 4:
                return "bg-green-700";
            case -1:
            default:
                return "bg-gray-300";
        }
    };

    const renderStrengthBar = () => {
        const bars = Array(5).fill(0).map((_, index) => (
            <div
                key={index}
                className={`h-1 w-full mr-1 last:mr-0 rounded ${index <= passwordStrength ? getPasswordStrengthColor(passwordStrength) : "bg-gray-300"}`}
            ></div>
        ));
        return <div className="flex mt-2">{bars}</div>;
    };

    return (
        <div className="max-w-md backdrop-blur-lg w-full mx-auto rounded-2xl font-dm-sans  dark:bg-black p-4 shadow-lg h-[500px] overflow-y-auto">
            <h2 className="font-bold text-teal-700 text-lg dark:text-neutral-200">
                Welcome to {import.meta.env.VITE_SITE_NAME}
            </h2>
            <p className="text-neutral-600 text-xs mt-1 dark:text-neutral-300">
                Login to {import.meta.env.VITE_SITE_NAME} if you can because we don&apos;t have a login flow yet
            </p>

            <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
                <div className="flex w-full flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
                    <LabelInputContainer className='w-[50%]'>
                        <Label htmlFor="firstName" className='text-teal-700'>First name</Label>
                        <Input id="firstName" name="firstName" placeholder="John" type="text" disabled={isLoading} />
                        {errors.firstName && <p className="text-red-600 text-xs">{errors.firstName}</p>}
                    </LabelInputContainer>
                    <LabelInputContainer className='w-[50%]'>
                        <Label htmlFor="lastName" className='text-teal-700'>Last name</Label>
                        <Input id="lastName" name="lastName" placeholder="Smith" type="text" disabled={isLoading} />
                        {errors.lastName && <p className="text-red-600 text-xs">{errors.lastName}</p>}
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-2">
                    <Label htmlFor="email" className='text-teal-700'>Email Address</Label>
                    <Input id="email" name="email" placeholder="example@gmail.com" type="email" disabled={isLoading} />
                    {errors.email && <p className="text-red-600 text-xs">{errors.email}</p>}
                </LabelInputContainer>

                <div  className="flex w-full flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-2">
                    <LabelInputContainer className="mb-2 w-[50%]">
                        <Label htmlFor="password" className='text-teal-700 '>Password</Label>
                        <Input id="password" name="password" placeholder="••••••••" type="password" disabled={isLoading} onChange={handlePasswordChange} />
                        {renderStrengthBar()}
                        {errors.password && <p className="text-red-600 text-xs">{errors.password}</p>}
                    </LabelInputContainer>
                    <LabelInputContainer className="mb-4 w-[50%]">
                        <Label htmlFor="confirmPassword" className='text-teal-700'>Confirm Password</Label>
                        <Input id="confirmPassword" name="confirmPassword" placeholder="••••••••" type="password" disabled={isLoading} />
                        {errors.confirmPassword && <p className="text-red-600 text-xs">{errors.confirmPassword}</p>}
                    </LabelInputContainer>
                </div>

                <button
                    className={`bg-gradient-to-br relative from-teal-500 to-teal-700 block dark:bg-zinc-800 w-full text-white rounded-md h-9 font-medium shadow`}
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span>Loading...</span>
                    ) : (
                        <>
                            Sign up &rarr;
                        </>
                    )}
                </button>

                <div className="mt-2 text-center">
                    <span className="text-xs text-neutral-600 dark:text-neutral-300">
                        Already have an account?{" "}
                        <Link to="/login" className="text-teal-700 hover:underline">
                            Login
                        </Link>
                    </span>
                </div>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-4 h-[1px] w-full" />

                <div className="flex flex-col items-center space-y-2">
                    <button
                        className="relative flex space-x-2 items-center justify-center px-2 w-full text-black rounded-md h-9 font-medium bg-gray-50 dark:bg-zinc-900"
                        type="button"
                        onClick={handleGoogleButton}
                    >
                        <CgGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-xs text-neutral-700 dark:text-neutral-300">
                            Continue with Google
                        </span>
                    </button>
                </div>
            </form>
        </div>

    );
}

const LabelInputContainer = ({ children, ...props }) => (
    <div {...props} className={cn("flex flex-col space-y-1", props.className)}>
        {children}
    </div>
);

const BottomGradient = () => (
    <div className="bottom-gradient group-hover/btn:bottom-gradient-hover hidden absolute bottom-[1px] left-0 right-0 h-[1px] bg-gradient-to-r from-[#ffffff00] via-white to-[#ffffff00] dark:via-black" />
);
