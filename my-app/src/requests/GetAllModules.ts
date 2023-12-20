import { modules, draft_mission } from './MockData';
import { IModuleProps } from '../components/ModuleCard';

export type Response = {
    draft_mission: string | null;
    modules: IModuleProps[];
}

export async function getAllModules(filter?: string): Promise<Response> {
    let url = '/api/modules/'
    if (filter !== undefined) {
        url += `?name=${filter}`
    }
    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return fromMock(filter)
            }
            return response.json() as Promise<Response>
        })
        .catch(_ => {
            return fromMock(filter)
        })
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