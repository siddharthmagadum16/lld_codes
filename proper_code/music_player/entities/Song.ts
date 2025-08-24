class Song {
  private songId: number;
  private title: string;
  constructor(_songId: number, _title: string) {
    this.songId = _songId;
    this.title = _title;
  }

  getTitle = () => this.title;
}

export default Song;