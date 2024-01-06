import { modules, draft_mission } from './MockData';
import { IModule } from '../models';
import axios, { AxiosRequestConfig } from 'axios';

const ip = 'localhost'
const port = '3000'
export const imagePlaceholder = `${import.meta.env.BASE_URL}placeholder.jpg`

export const axiosAPI = axios.create({ baseURL: `http://${ip}:${port}/api/`, timeout: 2000 });
export const axiosImage = axios.create({ baseURL: `http://${ip}:${port}/images/`, timeout: 10000 });

export type Response = {
    draft_mission: string | null;
    modules: IModule[];
}

export async function getAllModules(filter?: string): Promise<Response> {
    let url = 'modules';
    if (filter !== undefined) {
        url += `?name=${filter}`;
    }
    const headers: AxiosRequestConfig['headers'] = {};
    let accessToken = localStorage.getItem('access_token');
    if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return axiosAPI.get<Response>(url, { headers })
        .then(response => response.data)
        .catch(_ => fromMock(filter))
}

function fromMock(filter?: string): Response {
    let filteredModules = Array.from(modules.values())
    if (filter !== undefined) {
        let name = filter.toLowerCase()
        filteredModules = filteredModules.filter(
            (module) => module.name.toLowerCase().includes(name)
        )
    }
    return { draft_mission, modules: filteredModules }
}

export async function getModule(moduleId?: string): Promise<IModule | undefined> {
    if (moduleId === undefined) {
        return undefined
    }
    let url = 'modules/' + moduleId
    return axiosAPI.get<IModule>(url)
        .then(response => response.data)
        .catch(_ => modules.get(moduleId))
}