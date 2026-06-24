import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { subscriptionPlans } from "@/utils/plans";
import { SubscriptionButton } from "./subscription-button";

export function GridPlans() {
    return (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-5">
            {subscriptionPlans.map((plan, index) => (
                <Card
                    key={plan.id}
                    className={`flex flex-col w-full mx-auto relative ${index === 1 && "border-accent-primary pt-10"}`}
                >
                    {index === 1 && (                      
                        <div className="absolute top-0 left-0 bg-accent-primary w-full py-2 text-center rounded-t-lg">
                            <p className="text-sm font-semibold text-white tracking-wider">PROMOÇÃO EXCLUSIVA</p>
                        </div>
                    )}
                    
                    <CardHeader>
                        <CardTitle className="text-xl md:text-2xl">
                            {plan.name}
                        </CardTitle>
                        <CardDescription>
                            {plan.description}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="flex-1">
                        <ul>
                            {plan.features.map((feature, index) => (
                                <li key={index} className="text-sm md:text-base">
                                    {feature}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-4">
                            <p className="text-content-secondary line-through">{plan.oldPrice}</p>
                            <p className="text-content-primary text-2xl font-bold">{plan.price}</p>
                        </div>
                    </CardContent>

                    <CardFooter>
                        <SubscriptionButton
                            type={plan.id === "BASIC" ? "BASIC" : "PROFESSIONAL"} />
                    </CardFooter>
                </Card>
            ))}
        </section>
    )
}