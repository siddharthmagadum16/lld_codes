import Person from "./entities/Person";
import { IMusicPlayer } from "./interfaces/interface";
import MusicPlayerService from "./services/MusicPlayerService";


const demo = () => {

  const person0 = new Person(0, 'user0');
  const person1 = new Person(1, 'user1');
  const person2 = new Person(2, 'user2');
  const person3 = new Person(3, 'user3');


  const musicPlayerServiceInst: IMusicPlayer = MusicPlayerService.getInstance();

  musicPlayerServiceInst.addSong('Hanuman Chalisa');
  musicPlayerServiceInst.addSong('Pal');
  musicPlayerServiceInst.addSong('Tere bin');
  musicPlayerServiceInst.addSong('Dus');

  musicPlayerServiceInst.playSong(0, person0.getId())
  musicPlayerServiceInst.playSong(1, person0.getId())
  musicPlayerServiceInst.playSong(2, person0.getId())
  
  musicPlayerServiceInst.playSong(1, person1.getId())
  musicPlayerServiceInst.playSong(2, person1.getId())
  musicPlayerServiceInst.playSong(2, person2.getId())

  musicPlayerServiceInst.printAnalytics();

}


demo();
