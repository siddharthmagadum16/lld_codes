import { Node } from '../entites/Node'
import { File } from '../entites/File'
import { FileFactory } from './file_factory';
import { FileType } from '../interfaces/index';


class FileSystemService {

  private static instance: FileSystemService;
  private root: Node = new Node();
  private nodeStack: Node[] = [];
  private fileFactoryInst: FileFactory;

  constructor () {
    this.fileFactoryInst = FileFactory.getInstance();
    this.nodeStack.push(this.root);
  }


  static getInstance() {
    if (!FileSystemService.instance) {
      return FileSystemService.instance = new FileSystemService();
    }
    return FileSystemService.instance;
  }


  createDirectory(dirName: string): void {
    const currNode = this.nodeStack.at(-1)!;
    if (currNode.directories.has(dirName)) {
      return ;
    }
    currNode.directories.set(dirName, new Node());
  }

  renameDirectory(currDirName: string, newDirName: string) {
    const currNode = this.nodeStack.at(-1)!;
    if (!currNode.directories.has(currDirName)) {
      return ;
    }
    currNode.directories.set(newDirName, currNode.directories.get(currDirName)!);
    currNode.directories.delete(currDirName);
  }

  createFile(fileName: string, type: FileType, data: string): void {
    // check if file already exsits
    const currNode = this.nodeStack.at(-1)!;
    if (currNode.files.has(fileName)) {
      throw new Error(`File already exists: ${fileName}`);
    }
    const newFile: File = this.fileFactoryInst.createFile(fileName, type, data);
    currNode.files.set(newFile.fileName, newFile);
  }

  readFile(fileName: string) {
    const currNode = this.nodeStack.at(-1)!;
    if (!currNode.files.has(fileName)) {
      throw new Error(`File does not exists: ${fileName}`);
    }
    console.log('FILE CONTENTS: ', currNode.files.get(fileName)?.data);
  }

  deleteFile(fileName: string): void {
    const currNode = this.nodeStack.at(-1)!;

    if (currNode.files.has(fileName)) {
      currNode.files.delete(fileName);
      return;
    }
    throw new Error(`File does not exists: ${fileName}`);
  }

  gotIntoDir(dirName: string) {
    const currNode = this.nodeStack.at(-1)!;

    if (currNode.directories.has(dirName)) {
      const navNode = currNode.directories.get(dirName)!;
      this.nodeStack.push(navNode);
      return ;
    }
    throw new Error(`Dir does not exists: ${dirName}`);
  }

  comeBack() {
    if (this.nodeStack.length == 1) {
      console.log('Alreay at Root directory');
    }
    else {
      this.nodeStack.pop();
    }
  }

  display() {
    const currNode = this.nodeStack.at(-1)!;

    console.log('--- DIRECTORIES --- ');
    
    currNode.directories.keys().forEach((dirname: string) => {
      console.log(dirname);
    });

    console.log('--- FILES --- ');
    currNode.files.keys().forEach((fileName: string) => {
      console.log(`fileName: ${fileName}, fileType:${currNode.files.get(fileName)?.type}`);
    });
    console.log('\n')
  }

  deleteDir(dirName: string) {
    const currNode = this.nodeStack.at(-1)!;
    if (!currNode.directories.has(dirName)) {
      throw new Error(`Directory ${dirName} doesnt exists`);
    }
    currNode.directories.delete(dirName);
  }
}

export { FileSystemService }