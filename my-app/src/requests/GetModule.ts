import { modules } from './MockData';
import { IModuleProps } from '../components/ModuleCard';

const api = '/api/modules/'

export async function getModule(moduleId?: string): Promise<IModuleProps | undefined> {
    if (moduleId === undefined) {
        return undefined
    }
    let url = api + moduleId
    return fetch(url)
        .then(response => {
            if (response.status >= 500 || response.headers.get("Server") == "GitHub.com") {
                return modules.get(moduleId)
            }
            return response.json() as Promise<IModuleProps | undefined>
        })
        .catch(_ => {
            return modules.get(moduleId)
        })
}