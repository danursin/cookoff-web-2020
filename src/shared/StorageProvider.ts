import config from "../config";
import cookie from "js-cookie";

const { accessTokenName } = config;

export const storeToken = (value: string): void => {
    cookie.set(accessTokenName, value);
};

export const getToken = (): string | null => {
    const token = cookie.get(accessTokenName);
    if (token) {
        return token;
    }
    return null;
};

export const clearToken = (): void => {
    cookie.remove(accessTokenName);
};
