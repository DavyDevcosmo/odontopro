export type PlansDetailsProps = {
    maxServices: number;
}

export type PlansProps = {
    BASIC: PlansDetailsProps;
    PROFESSIONAL: PlansDetailsProps
}

export const PLANS: PlansProps = {
    BASIC: {
        maxServices: 3,
    },
    PROFESSIONAL: {
        maxServices: 50
    }
}

export const subscriptionPlans = [
 {
    id: "BASIC",
    name: "Basic",
    description: "Perfeito para clinícas menores",
    oldPrice: "R$ 97,90",
    price: "R$ 27,90",
    features: [
        `Até ${PLANS["BASIC"].maxServices} serviços`,
        'Agendamentos ilimitados',
        'Suporte',
        'Relatório',
    ]
 },

 {
    id: "PROFESSIONAL",
    name: "Professional",
    description: "Ideal para clinícas grandes",
    oldPrice: "R$ 197,90",
    price: "R$ 97,90",
    features: [
        `Até ${PLANS["PROFESSIONAL"].maxServices} serviços`,
        'Agendamentos ilimitados',
        'Suporte prioritário',
        'Relatório avançados',
    ]
 }
]