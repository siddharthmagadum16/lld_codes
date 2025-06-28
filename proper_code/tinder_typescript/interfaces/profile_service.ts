import { Gender } from "../common/interface"
import Profile from "../entities/profile";


interface ProfileService {

  createProfile(name: string, gender: Gender, email: string, password: string): Profile;
  addPicture(profile: Profile, pic: string): void;
}


export default ProfileService;