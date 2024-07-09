export type Project = {
    id?: string
    title: string,
    genre: string,
    description: string,
    media: {
        mediaPath: string,
        images: string[]
    },
    responsabilities: string[],
    skills: string[],
    links:{name: string,url: string}[],
    date: string
}

export type ProjectForm = {
    id?: string,
    title: string,
    genre: string,
    description: string,
    responsabilities: string[],
    links:{name: string,url: string}[]
    skills: string[],
    date: string
}