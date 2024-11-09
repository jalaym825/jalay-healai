import React, { useState } from "react";
import { Label } from "../../UIs/shadcn-ui/label";
import { Input } from "../../UIs/shadcn-ui/input";
import { cn } from "../../UIs/utils/cn";
import { Link, useNavigate } from "react-router-dom";
import Global from "../../Utils/Global";
import { toast } from "sonner";
import { CgGoogle } from "react-icons/cg";

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
            navigate("/login");
        } catch (err) {
            toast.error(err.message);
            console.error(err.message);
        } finally {
            setIsLoading(false); // Reset loading state after HTTP request completes
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
                className={`h-1 w-1/6 mr-1 last:mr-0 rounded ${index <= passwordStrength ? getPasswordStrengthColor(passwordStrength) : "bg-gray-300"}`}
            ></div>
        ));
        return <div className="flex mt-2">{bars}</div>;
    };

    return (
        <div className="max-w-md w-full mx-auto rounded-2xl font-dm-sans bg-white dark:bg-black p-8 shadow-lg">
            <h2 className="font-bold text-teal-700 text-xl dark:text-neutral-200">
                Welcome to {import.meta.env.VITE_SITE_NAME}
            </h2>
            <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
                Login to {import.meta.env.VITE_SITE_NAME} if you can because we don&apos;t have a login flow yet
            </p>

            <form className="my-8" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="firstName" className='text-teal-700'>First name</Label>
                        <Input id="firstName" name="firstName" placeholder="John" type="text" disabled={isLoading} />
                        {errors.firstName && <p className="text-red-600 font-bold text-sm">{errors.firstName}</p>}
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastName" className='text-teal-700'>Last name</Label>
                        <Input id="lastName" name="lastName" placeholder="Smith" type="text" disabled={isLoading} />
                        {errors.lastName && <p className="text-red-600 font-bold text-sm">{errors.lastName}</p>}
                    </LabelInputContainer>
                </div>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="email" className='text-teal-700'>Email Address</Label>
                    <Input id="email" name="email" placeholder="example@gmail.com" type="email" disabled={isLoading} />
                    {errors.email && <p className="text-red-600 font-bold text-sm">{errors.email}</p>}
                </LabelInputContainer>
                <LabelInputContainer className="mb-4">
                    <Label htmlFor="password" className='text-teal-700'>Password</Label>
                    <Input id="password" name="password" placeholder="••••••••" type="password" disabled={isLoading} onChange={handlePasswordChange} />
                    {renderStrengthBar()}
                    {errors.password && <p className="text-red-600 font-bold text-sm">{errors.password}</p>}
                </LabelInputContainer>
                <LabelInputContainer className="mb-8">
                    <Label htmlFor="confirmPassword" className='text-teal-700'>Confirm Password</Label>
                    <Input id="confirmPassword" name="confirmPassword" placeholder="••••••••" type="password" disabled={isLoading} />
                    {errors.confirmPassword && <p className="text-red-600 font-bold text-sm">{errors.confirmPassword}</p>}
                </LabelInputContainer>

                <button
                    className={`bg-gradient-to-br relative group/btn from-teal-500 to-teal-700 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]`}
                    type="submit"
                    disabled={isLoading} // Disable button when loading or form is disabled
                >
                    {isLoading ? (
                        <span>Loading...</span> // Show loading text or spinner
                    ) : (
                        <>
                            Sign up &rarr;
                            <BottomGradient />
                        </>
                    )}
                </button>

                <div className="mt-4 text-center">
                    <span className="text-l text-neutral-600 dark:text-neutral-300">
                        Already have an account?{" "}
                        <Link to="/login" className="text-teal-700 hover:underline">
                            Login
                        </Link>
                    </span>
                </div>

                <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

                <div className="flex flex-col items-center space-y-4">
                    <button
                        className="relative group/btn flex space-x-2 items-center justify-center px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
                        type="button"
                        onClick={handleGoogleButton}
                    >
                        <CgGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
                        <span className="text-neutral-700 dark:text-neutral-300 text-sm">
                            Continue with Google
                        </span>
                        <BottomGradient />
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
