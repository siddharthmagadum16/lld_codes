import { FileType } from "../interfaces/index";



abstract class File {
  public fileName: string;
  public data: string;
  public type: FileType;

  constructor (fileName: string, type: FileType, data: string = '') {
    this.fileName = fileName;
    this.type = type;
    this.data = data;
  }
  abstract setData(data: string): void;
}

class TextFile extends File {

  setData(data: string): void {
    this.data = data;
  }
}

class ImageFile extends File {

  setData(data: string): void {
    this.data = data;
  }
}


export {
  File,
  TextFile,
  ImageFile,
}