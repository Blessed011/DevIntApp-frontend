export interface IModule {
    uuid: string
    name: string
    description: string
    mass: string
    length: string
    diameter: string
    image_url: string
}

export interface IMission {
    uuid: string
    name: string | null
    status: string
    creation_date: string
    formation_date: string | null
    completion_date: string | null
    moderator: string | null
    customer: string
    funding_status: string | null
}