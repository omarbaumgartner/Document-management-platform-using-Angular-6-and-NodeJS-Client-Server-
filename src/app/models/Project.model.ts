export class Project {
    id: number;
    name: string;
    description: string;
    creatorId: number;
    members: Array<number>;
    documents: Array<number>;
    finished: boolean;
    createdAt: string;
    updatedAt: string;
}
