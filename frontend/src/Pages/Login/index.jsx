import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "../../UIs/shadcn-ui/input";
import { Label } from "../../UIs/shadcn-ui/label";
import { cn } from "../../UIs/utils/cn";
import Global from "../../Utils/Global";
import { CgGoogle } from "react-icons/cg";

export function Login() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });

  // Keeping all the existing functionality...
  const validateForm = (email, password) => {
    const newErrors = { email: "", password: "" };
    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email is invalid";
    if (!password) newErrors.password = "Password is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = e.target.elements;

    const newErrors = validateForm(email.value, password.value);
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setIsLoading(true);

    try {
      const res = await Global.httpPost('/auth/login', {
        email: email.value,
        password: password.value
      });
      Global.user = res.user;
      Global.token = res.token;
      navigate("/");
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleButton = async () => {
    setIsLoading(true);
    try {
      window.location.href = `${import.meta.env.VITE_BACKEND_SERVER_URL}/auth/google`;
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }
    
  return (
    <div className="max-w-md w-full mx-auto font-dm-sans rounded-2xl bg-white dark:bg-black p-8 shadow-lg">
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-teal-500 to-teal-700 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="font-bold text-2xl text-teal-700 dark:text-teal-400">
          Welcome Back
        </h2>
        <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300">
          Your journey to mental wellness continues here
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} noValidate>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email" className="text-teal-700 dark:text-teal-400">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="example@gmail.com"
            type="email"
            disabled={isLoading}
            className={cn(
              "border-teal-100 focus:border-teal-500 focus:ring-teal-500 bg-white dark:bg-zinc-900",
              errors.email && "border-red-500"
            )}
          />
          {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="password" className="text-teal-700 dark:text-teal-400">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="••••••••"
            type="password"
            disabled={isLoading}
            className={cn(
              "border-teal-100 focus:border-teal-500 focus:ring-teal-500 bg-white dark:bg-zinc-900",
              errors.password && "border-red-500"
            )}
          />
          {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
        </LabelInputContainer>

        <button
          className="relative w-full px-4 py-3 bg-gradient-to-r from-teal-500 to-teal-700 text-white rounded-lg font-medium shadow-lg hover:from-teal-600 hover:to-teal-800 transition-all duration-300 focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
              <span>Connecting...</span>
            </div>
          ) : (
            <span className="flex items-center justify-center">
              Continue your journey
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </span>
          )}
        </button>

        <div className="mt-6 text-center">
          <span className="text-neutral-600 dark:text-neutral-400">
            New to our community?{" "}
            <Link to="/signup" className="text-teal-600 hover:text-teal-700 font-medium">
              Join us today
            </Link>
          </span>
        </div>

        <div className="mt-4 text-center">
          <Link to="/forgot-password" className="text-teal-600 hover:text-teal-700 text-sm">
            Forgot your password?
          </Link>
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-black text-neutral-500">
              Or continue with
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleGoogleButton}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-white dark:bg-zinc-800 text-neutral-700 dark:text-neutral-300 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-zinc-700 transition duration-300 shadow-sm"
        >
          <CgGoogle className="w-5 h-5" />
          <span>Continue with Google</span>
        </button>
      </form>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-teal-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({ children, className }) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};