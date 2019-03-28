export class Project {
    id: number;
    name: string;
    description: string;
    creatorId: number;
    members: Array<number>;
    finished: boolean;
    createdAt: string;
    updatedAt: string;
}
