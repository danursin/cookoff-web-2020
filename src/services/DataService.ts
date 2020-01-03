import axios from "axios";
import config from "../config";
import { getToken } from "../shared/StorageProvider";

const { cookoffApiUrl, accessTokenName } = config;

const _axios = axios.create({
    baseURL: cookoffApiUrl
});

_axios.interceptors.request.use(config => {
    config.headers = { ...config.headers, [accessTokenName]: getToken() };
    return config;
});

export const destroy = async (request: DestroyRequest): Promise<any> => {
    const { data } = await _axios.post("/destroy", request);
    return data;
};

export const insert = async (request: InsertRequest): Promise<any> => {
    const { data } = await _axios.post("/insert", request);
    return data;
};

export const query = async <T = any>(request: QueryRequest): Promise<T[]> => {
    const { data } = await _axios.post<T[]>("/query", request);
    return data;
};

export const update = async (request: UpdateRequest): Promise<any> => {
    const { data } = await _axios.post("/update", request);
    return data;
};

export const sproc = async <T = any>(request: SprocRequest): Promise<T[]> => {
    const { data } = await _axios.post("/sproc", request);
    return data;
};

export const uploadFile = async (data_uri: string): Promise<string> => {
    const request: { data_uri: string } = { data_uri };
    const {
        data: { filekey }
    } = await _axios.post<{ filekey: string }>("/file", request);
    return filekey;
};

export interface DestroyRequest {
    table: string;
    where: number[] | { [key: string]: any };
}

export interface InsertRequest {
    table: string;
    values: { [key: string]: any } | { [key: string]: any }[];
}

export interface QueryRequest {
    table: string;
    where?: { [key: string]: any };
    skip?: number;
    take?: number;
    select?: string[];
    relations?: string[];
    order?: {
        [key: string]: "ASC" | "DESC";
    };
}

export interface UpdateRequest {
    table: string;
    where: { [key: string]: any };
    values: { [key: string]: any };
}

export interface SprocRequest {
    objectName: string;
    parameters?: {
        [key: string]: number | string | null;
    };
}
