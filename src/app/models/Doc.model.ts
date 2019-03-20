export class Doc {
    id: number;
    projectId: number;
    authorId: number;
    filename: string;
    // encoding: string;
    // extension: string;
    path: string;
    // sizeinko: number;
    version: Array<number>;
    validated: boolean;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}
