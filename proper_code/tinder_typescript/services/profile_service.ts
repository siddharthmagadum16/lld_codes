import { Gender } from "../common/interface";
import Profile from "../entities/profile";
import ProfileService from "../interfaces/profile_service";



class ProfileServiceImpl implements ProfileService {

  createProfile = (name: string, gender: Gender, email: string, password: string): Profile => {
    return new Profile(name, gender, email, password);
  }

  addPicture = (profile: Profile, pic: string): void => {
    profile.addPicture(pic);
  }


}


export default ProfileServiceImpl;