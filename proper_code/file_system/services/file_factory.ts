import { FileType } from "../interfaces/index"
import { File, ImageFile, TextFile } from '../entites/File';

class FileFactory {
  private fileMap: Map<FileType, new (fileName: string, type: FileType, data: any) => File> = new Map();
  private static instance: FileFactory;

  constructor() {
    this.fileMap = new Map([
      [FileType.TEXT, TextFile],
      [FileType.IMAGE, ImageFile],
    ]);
  }
  static getInstance() {
    if (!FileFactory.instance) {
      return FileFactory.instance = new FileFactory();
    }
    return FileFactory.instance;
  }

  createFile(fileName: string, type: FileType, data: any): File {
    const constructor = this.fileMap.get(type);
    if (!constructor) {
      throw new Error(`No constructor found for file type: ${type}`);
    }
    return new constructor(fileName, type, data);
  }

}

export { FileFactory }