import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "₹0",
    description: "For students and early learners starting their career journey.",
    features: [
      "1 Portfolio Website",
      "1 Resume Optimization",
      "Basic Skills Tracker",
      "Limited CodeQuests",
    ],
    button: "Get Started",
    highlight: false,
  },
  {
    name: "Pro",
    price: "₹499",
    description: "Best for job seekers who want to level up their career tools.",
    features: [
      "Unlimited Portfolios",
      "Unlimited Resume Optimizations",
      "Advanced Skills Insights",
      "Unlimited CodeQuests",
      "Priority Email Support",
    ],
    button: "Upgrade to Pro",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description:
      "For universities, bootcamps & enterprises managing multiple users.",
    features: [
      "Team Management",
      "Custom Career OS Branding",
      "Advanced Analytics",
      "Dedicated Support",
      "API Access",
    ],
    button: "Contact Sales",
    highlight: false,
  },
];

export default function Plan() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
      {/* Background same as Hero */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-[#050505] via-[#0f172a] to-[#1f2937]" />
        <div className="absolute inset-0 opacity-25 bg-gradient-to-tr from-emerald-400/20 via-transparent to-cyan-400/20" />
        <div className="absolute inset-0 opacity-25 bg-gradient-to-bl from-cyan-500/20 via-transparent to-emerald-400/20" />
        <div
          className="absolute inset-0 opacity-40 transition-all duration-300"
          style={{
            background: `radial-gradient(500px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(16,255,180,0.15), transparent 40%)`,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold">
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500 bg-clip-text text-transparent animate-gradient">
              Career OS Plans
            </span>
          </h2>
          <p className="mt-4 text-lg text-gray-400">
            Choose the plan that fits your career growth stage.
          </p>
        </div>

        {/* Pricing Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative flex flex-col rounded-2xl bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 p-8 shadow-lg shadow-emerald-500/10 transition transform hover:scale-105 hover:shadow-emerald-400/20 ${
                plan.highlight ? "border-2 border-emerald-400" : ""
              }`}
            >
              {/* Badge for Popular */}
              {plan.highlight && (
                <span className="absolute top-4 right-4 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  Popular
                </span>
              )}

              {/* Plan Name */}
              <h3 className="text-2xl font-semibold text-gray-200">
                {plan.name}
              </h3>
              <p className="mt-2 text-gray-400">{plan.description}</p>

              {/* Price */}
              <div className="mt-6 mb-4">
                <span className="text-4xl font-bold text-white">
                  {plan.price}
                </span>
                {plan.name !== "Enterprise" && (
                  <span className="text-gray-400 text-sm"> /month</span>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 flex-1">
                {plan.features.map((feature, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2 text-gray-300"
                  >
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                className={`mt-8 py-3 px-6 rounded-xl font-medium transition ${
                  plan.highlight
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-gray-800 text-gray-200 hover:bg-gray-700"
                }`}
              >
                {plan.button}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
