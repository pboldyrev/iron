import { PlanOption } from "../../../billing-option/billing-option.component";

export const PLAN_OPTIONS: PlanOption[] = [
    {
        name: "Basic",
        price: "Free",
        link: "/settings",
        benefits: [
            "Up to 5 assets",
            "Weekly automatic asset value updates"
        ],
        selected: false,
        tag: "",
    },
    {
        name: "Premium Monthly",
        price: "$3.99/mo.",
        link: "",
        benefits: [
            "Unlimited assets",
            "Daily automatic asset value updates",
            "AI-powered portfolio feedback",
            "No commitments, cancel any time"
        ],
        selected: false,
        tag: "",
    },
    {
        name: "Premium Yearly",
        price: "$39.99/yr.",
        link: "/settings",
        benefits: [
            "Unlimited assets",
            "Daily automatic asset value updates",
            "AI-powered portfolio feedback",
            "No commitments, cancel any time"
        ],
        selected: false,
        tag: "Best value",
    },
]