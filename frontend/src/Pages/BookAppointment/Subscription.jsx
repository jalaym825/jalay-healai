import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "../../UIs/shadcn-ui/card";
import axios from "axios";
import { toast } from "sonner";
import Global from "@/Utils/Global";

const Subscription = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    };

    const navigate = useNavigate();

    function loadScript(src) {
        toast.loading("Processing...")
        return new Promise((resolve) => {
            const script = document.createElement("script");
            script.src = src;
            script.onload = () => {
                resolve(true);
            };
            script.onerror = () => {
                resolve(false);
            };
            document.body.appendChild(script);
        });
    }


    async function displayRazorpay(plan) {
        const res = await loadScript(
            "https://checkout.razorpay.com/v1/checkout.js"
        );

        console.log(res)

        if (!res) {
            toast.error("Razorpay SDK failed to load. Are you online?")
        }

        const body = {
            amount: plan.price,
        }

        // creating a new order
        const result = await Global.httpPost("/razorpay/payment", body);
        console.log(result)

        if (!result) {
            toast.error(result.response.statusText);
            return;
        }

        const { amount, id: order_id } = result.order;

        const options = {
            key: "rzp_test_kGF26SIu82U87v",
            amount: amount.toString(),
            // currency: currency,
            name: { name },
            description: "Test Transaction",
            order_id: order_id,
            handler: async function (response) {
                // const responseData = {
                //     orderCreationId: order_id,
                //     razorpayPaymentId: response.razorpay_payment_id,
                //     razorpayOrderId: response.razorpay_order_id,
                //     razorpaySignature: response.razorpay_signature,
                // };

                const body = {
                    plan
                }

                const paymentResponse = await Global.httpPost("/razorpay/updateSubscription", body)
                if (paymentResponse.message === "Subscription buy successfully!") {
                    toast.success(paymentResponse.message);
                }

            },
            prefill: {
                name: { name }
            },
            notes: {
                address: "Surat",
            },
            theme: {
                color: "#61dafb",
            },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
    }

    const buttonHandler = (plan) => {
        console.log(plan.price)
        if (plan.price === 0) {
            window.location.href = "http://localhost:5173/chatbot"
        }
        else {
            displayRazorpay(plan)
        }
    }

    return (
        <div className="relative font-dm-sans w-full max-w-6xl mx-auto p-3 bg-[#fdfbf7]">
            {/* Decorative Elements */}
            <div className="absolute left-0 top-0 w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full fill-[#00A99D]">
                    <path d="M0,50 a50,50 0 1,0 50,-50 L0,0 Z" opacity="0.2" />
                </svg>
            </div>
            <div className="absolute right-0 top-0 w-32 h-32">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                    <pattern
                        id="dots"
                        x="0"
                        y="0"
                        width="10"
                        height="10"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="2" cy="2" r="1" fill="#000" opacity="0.2" />
                    </pattern>
                    <rect width="100" height="100" fill="url(#dots)" />
                </svg>
            </div>

            {/* Header */}
            <motion.div
                className="text-center mb-16 relative z-10"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-4xl md:text-5xl font-bold text-[#2D3648] mb-4">
                    Pricing Plans
                </h2>
                <div className="w-24 h-4 mx-auto">
                    <svg viewBox="0 0 100 20" className="w-full h-full">
                        <motion.path
                            d="M0,10 Q25,20 50,10 T100,10"
                            fill="none"
                            stroke="#00A99D"
                            strokeWidth="4"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1, ease: "easeInOut" }}
                        />
                    </svg>
                </div>
                <p className="text-xl mt-4 text-[#2D3648]">Choose Your Best Plan</p>
            </motion.div>

            {/* Pricing Cards */}
            <motion.div
                className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto relative z-10"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {[
                    {
                        name: "Free",
                        price: 0,
                        highlight: false,
                        features: [
                            "Email Support",
                            "Limited Live Video Checkups",
                        ],
                    },
                    {
                        name: "Premium",
                        price: 500,
                        highlight: true,
                        features: [
                            "Priority Email Support",
                            "40 Free Appointment Bookings",
                            "Standard Live Video Checkups",
                        ],
                    },
                    {
                        name: "Platinum",
                        price: 1500,
                        highlight: false,
                        features: [
                            "24/7 Priority Support",
                            "90 Free Appointment Bookings",
                            "Live Video Checkups with Specialists",
                        ],
                    },
                ].map((plan) => (
                    <motion.div key={plan.name} variants={cardVariants}>
                        <Link onClick={() => {
                            buttonHandler(plan)
                        }} className="block">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                className="group"
                            >
                                <Card
                                    className={`relative overflow-hidden border-2 transition-all duration-300 ease-in-out ${plan.highlight
                                        ? "bg-[#00A99D] text-white border-[#00A99D] hover:bg-[#008C82] hover:border-[#008C82]"
                                        : "bg-white border-[#2D3648] border-opacity-20 hover:bg-[#F0F0F0] group-hover:text-[#00A99D]"
                                        }`}
                                >
                                    <CardHeader
                                        className={`${!plan.highlight ? "group-hover:text-[#00A99D]" : ""
                                            }`}
                                    >
                                        <h3 className="text-xl font-semibold mb-4">{plan.name}</h3>
                                        <div className="text-4xl flex font-bold mb-6">
                                            <p>
                                                <span className="text-2xl">₹</span>
                                                {plan.price}
                                            </p>
                                            <p className="text-sm mt-4">/per month</p>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="space-y-4">
                                            {plan.features.map((feature, index) => (
                                                <li key={index} className="flex items-center">
                                                    <span className="mr-2">•</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        </Link>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default Subscription;
