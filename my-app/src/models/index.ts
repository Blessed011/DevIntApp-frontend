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
    date_created: string
    date_approve: string | null
    date_end: string | null
    moderator: string | null
    customer: string
    funding_status: string | null
}