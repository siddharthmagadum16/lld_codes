
interface Analytics {
  songTitle: string;
  userCount: number;
}


interface IMusicPlayer {
  addSong(songTitle: string): void;
  playSong(songId: number, userId: number): void;
  printAnalytics(): void;
}

interface IPersonService {

}

export {
  IMusicPlayer,
  Analytics,
  IPersonService
}