import { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface Session {
        user: User & DefaultSession['user']
    }
}

interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
}
