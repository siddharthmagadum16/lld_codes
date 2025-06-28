

class Chat {
  private profileId1: number;
  private profileId2: number;
  private messages: Message[];

  constructor(profileId1: number, profileId2: number) {
    this.profileId1 = profileId1;
    this.profileId2 = profileId2;
  }
}

export default Chat;