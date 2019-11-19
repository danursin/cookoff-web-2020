import axios from "axios";
import config from "../config";

const { cookoffApiUrl } = config;

const _axios = axios.create({
    baseURL: cookoffApiUrl,
    withCredentials: true
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
