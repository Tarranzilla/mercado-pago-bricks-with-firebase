import { Address } from "./Address";

export type User = {
    id: string;
    name: string;
    email: string;
    avatar_url: string;

    isOwner: boolean;
    isAdmin: boolean;
    isEditor: boolean;
    isSubscriber: boolean;

    address: Address;
    telephone: string;

    orders: string[];
};
