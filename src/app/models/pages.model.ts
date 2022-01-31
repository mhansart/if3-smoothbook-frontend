import { Post } from "./post.model";

export class Page {
    id: number;
    name: string;
    type: string;
    route: string;
    content: string;
    active:string;
    posts? :Post[];
    views:string;
}