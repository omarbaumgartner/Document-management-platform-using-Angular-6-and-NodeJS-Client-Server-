export class Doc {
    id: number;
    projectid: number;
    authorid: number;
    filename: string;
    // encoding: string;
    // extension: string;
    path: string;
    // sizeinko: number;
    versions: Array<number>;
    validated: boolean;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}
