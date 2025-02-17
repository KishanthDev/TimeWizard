import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCheckoutSession, fetchSubscriptionStatus } from "../../slices/subscriptionSlice";
import { CheckCircle, XCircle } from "lucide-react";

const SubscriptionPlans = () => {
    const [selectedPlan, setSelectedPlan] = useState(null);
    const dispatch = useDispatch();
    const { sessionUrl, isLoading, plan, status } = useSelector((state) => state.subscription);

    // Fetch current subscription on page load
    useEffect(() => {
        dispatch(fetchSubscriptionStatus());
    }, [dispatch]);

    const plans = [
        { name: "Free", price: "₹0/month", value: "free", features: ["Up to 5 projects per month", "Up to 10 tasks per month", "Email Support"], unavailable: ["Activity logs", "General chat"] },
        { name: "Basic", price: "₹99/month", value: "basic", features: ["Up to 20 projects per month", "Up to 50 tasks per month", "Access to activity logs", "Email support"], unavailable: ["General chat"] },
        { name: "Premium", price: "₹179/month", value: "premium", features: ["Unlimited project creation", "Unlimited task creation", "Activity logs access", "Email support", "General chat for employees"], unavailable: [] }
    ];

    const handleSubscribe = (planValue) => {
        setSelectedPlan(planValue);
        dispatch(createCheckoutSession(planValue));
    };

    // Redirect to Stripe checkout when session URL is available
    useEffect(() => {
        if (sessionUrl) {
            window.location.href = sessionUrl;
        }
    }, [sessionUrl]);

    return (
        <div className="flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-6 overflow-hidden">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">Choose Your Plan</h2>
            <p className="mb-4 text-lg text-gray-600 dark:text-gray-300">
                Your current plan: <span className="font-bold">{plan.toUpperCase()}</span> ({status})
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-screen-xl relative">
                {plans.map((planItem) => {
                    const isPremiumUser = plan === "premium" && planItem.value === "premium";
    
                    const isDowngrade =
                        (plan === "premium" && planItem.value !== "premium") || 
                        (plan === "basic" && planItem.value === "free");
    
                    const canSubscribe = !isDowngrade && plan !== planItem.value;
    
                    return (
                        <div
                            key={planItem.value}
                            className={`relative p-6 rounded-2xl shadow-lg border transition duration-300 
                                ${
                                    isPremiumUser
                                        ? "border-[#FFD700] shadow-xl" // Gold border for Premium users
                                        : plan === planItem.value
                                        ? "border-blue-500 dark:border-blue-400 shadow-xl" // Blue for Basic
                                        : "border-gray-300 dark:border-gray-700" // Default
                                } 
                                bg-white dark:bg-gray-800`}
                        >
                            {/* 👑 Crown Badge for Premium Users */}
                            {isPremiumUser && (
                                <div className="absolute -top-6 -right-11 text-white text-5xl font-bold px-3 py-1 rotate-45 shadow-lg">
                                    👑
                                </div>
                            )}
    
                            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{planItem.name}</h3>
                            <p className="text-2xl font-bold text-gray-600 dark:text-gray-300">{planItem.price}</p>
                            <ul className="mt-4 space-y-2">
                                {planItem.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-700 dark:text-gray-300">
                                        <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                                        {feature}
                                    </li>
                                ))}
                                {planItem.unavailable.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-500 dark:text-gray-400 line-through">
                                        <XCircle className="w-5 h-5 text-red-500 mr-2" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            <button
    onClick={() => handleSubscribe(planItem.value)}
    className={`mt-6 w-full py-2 px-4 rounded-lg font-medium transition 
        ${
            plan === planItem.value
                ? "bg-green-500 text-white cursor-default"  // Green for Active Plan
                : canSubscribe
                ? "bg-blue-500 text-white hover:bg-blue-600" // Blue for selectable plans
                : "bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed" // Gray for disabled
        }`}
    disabled={!canSubscribe || isLoading || plan === planItem.value} // Disable active plan
>
    {isLoading && selectedPlan === planItem.value
        ? "Processing..."
        : plan === planItem.value
        ? "Active Plan"
        : "Choose Plan"}
</button>

                        </div>
                    );
                })}
            </div>
        </div>
    );
      
};

export default SubscriptionPlans;
