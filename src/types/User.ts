import { Address } from "./Address";

type AcceptedValues = string | boolean | Address | string[];

export type User = {
    [key: string]: AcceptedValues;
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
