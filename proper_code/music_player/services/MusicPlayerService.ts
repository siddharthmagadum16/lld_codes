import Song from "../entities/Song";
import { Analytics, IMusicPlayer } from "../interfaces/interface";


//TODO: implement interface
class MusicPlayerService  implements IMusicPlayer {

  private static instance: IMusicPlayer;

  //data members
  private songs:Map<number,Song> = new Map();
  private uniquePlays:Map<number, Set<number>> = new Map();

  private constructor() {}

  static getInstance = () => {
    if (!MusicPlayerService.instance) {
      MusicPlayerService.instance = new MusicPlayerService();
    }
    return MusicPlayerService.instance;
  }

  addSong = (songTitle: string): void => {
    const currNumOfSongs = this.songs.size;
    const song = new Song(currNumOfSongs, songTitle);
    this.songs.set(currNumOfSongs, song);
    console.log(`New song added: ${song.getTitle()}`);
  }

  playSong = (songId: number, userId: number): void => {
    const song = this.songs.get(songId);
    if (!song) {
      console.log('Song doesnt exists', songId);
      return ;
    }
    if (this.uniquePlays.has(songId)) this.uniquePlays.get(songId)!.add(userId);
    else this.uniquePlays.set(songId, new Set([userId]));
    console.log(`Song:${songId},${song.getTitle()} is played by user: ${userId}`)
    return ;
  }

  printAnalytics = () => {
    const playCounts:Analytics[]  = [];
    console.log(this.uniquePlays.entries());
    // this.uniquePlays.entries().map(([songId, usersPlayed]) => {
    for (const [songId, usersPlayed] of this.uniquePlays.entries()) {
      const userCount = usersPlayed.size;
      const songTitle = this.songs.get(songId)!.getTitle();
      playCounts.push({ 
        userCount,
        songTitle,
      });
    };

    playCounts.sort((a: Analytics, b: Analytics) => {
      return b.userCount - a.userCount;
    });
    console.log('Analytics:::');
    playCounts.forEach((songInfo: Analytics) => {
      console.log(`Song: ${songInfo.songTitle} \t\t\t\t was played by ${songInfo.userCount} users`);
    });
  }
}

export default MusicPlayerService;