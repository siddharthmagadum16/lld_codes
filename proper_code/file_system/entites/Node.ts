import { File } from "./File";

class Node {
    public directories: Map<string, Node> = new Map();
    public files: Map<string, File> = new Map();
}

export { Node }
