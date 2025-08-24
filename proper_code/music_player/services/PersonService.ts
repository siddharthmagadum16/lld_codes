// import Person from "../entities/Person";
// import Song from "../entities/Song";
// import { IMusicPlayer, IPersonService } from "../interfaces/interface";

// class PersonService implements IPersonService {

//   private static instance: IPersonService;
//   private musicPlayerServiceInst: IMusicPlayer | undefined;
//   private constructor() {}

//   static getInstance = () => {
//     if (!PersonService.instance) {
//       PersonService.instance = new PersonService();
//     }
//     return PersonService.instance;
//   }

//   setMPInstance = (inst: IMusicPlayer) => {
//     this.musicPlayerServiceInst = inst;
//   }

//   private persons: Map<number, Person> = new Map();
//   private songsPlayedByPerson: Map<number, Song[]>


//   playSong = (songId, userId) => {
//     this.musicPlayerServiceInst?.playSong(songId, userId);
//   }
// }