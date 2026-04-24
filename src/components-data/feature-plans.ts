interface FeaturedPlan {
    id: string
    name: string
    duration: string
    price: number
    features: string[]
}

export const FEATURED_PLANS: FeaturedPlan[] = [
    {
        id: "basic",
        name: "Basic",
        duration: "1-Day Feature",
        price: 45000,
        features: ["Featured in Top Events for 24 hours", "Priority placement in event feed", "“Featured” badge on your post"]
    },
    {
        id: "standard",
        name: "Standard",
        duration: "3-Day Feature",
        price: 85000,
        features: ["Featured for 72 hours", "Higher visibility across homepage & search", "Featured badge + boosted impressions", "Social media story promotion"]
    },
    {
        id: "advanced",
        name: "Advanced",
        duration: "7-Day Feature",
        price: 165000,
        features: ["Featured for 7 days", "Maximum visibility & sustained reach", "Featured badge + boosted impressions", "Weekly main social media post + story promotion"]
    }
]