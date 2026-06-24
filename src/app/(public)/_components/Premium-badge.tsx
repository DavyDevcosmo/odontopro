import { Star } from "lucide-react";

export function PremiumCardBedge() {
    return (
        <div className="absolute top-0 right-0 bg-accent-primary w-10 h-10 flex items-center justify-center">
            <Star className="text-white" />
        </div>
    )
}