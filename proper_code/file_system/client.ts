import { FileType } from "./interfaces/index";
import { FileSystemService } from "./services/file_system";
/* Note: this is implemented by myself */

const fileManager = FileSystemService.getInstance();

fileManager.createFile('rootFileA', FileType.TEXT, 'root level text file A');
fileManager.createFile('rootFileB', FileType.IMAGE, 'root level image file B');

fileManager.createDirectory('dirL1');
fileManager.display();

fileManager.gotIntoDir('dirL1');
fileManager.createFile('l1FileA', FileType.IMAGE, 'level1 text file A');
fileManager.readFile('l1FileA');
fileManager.display();

fileManager.createFile('rootFileA', FileType.TEXT, 'root level file A');
fileManager.createFile('rootFileB', FileType.TEXT, 'root level file B');

fileManager.comeBack();

fileManager.display();
fileManager.deleteFile('rootFileA');
fileManager.deleteDir('dirL1');
fileManager.createDirectory('dir2L1')
fileManager.display();
