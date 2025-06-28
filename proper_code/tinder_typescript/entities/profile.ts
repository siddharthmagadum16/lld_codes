class Profile {
  private name: string;
  private gender: string;
  private email: string;
  private password: string;
  private pictures: string[];

  constructor(name: string, gender: string, email: string, password: string) {
    this.name = name;
    this.gender = gender;
    this.email = email;
    this.password = password;
  }


  addPicture = (pic) => {
    this.pictures.push(pic);
  }

  // Getters
  getName(): string {
    return this.name;
  }

  getGender(): string {
    return this.gender;
  }

  getEmail(): string {
    return this.email;
  }

  getPassword(): string {
    return this.password;
  }

  // Setters
  setName(name: string): void {
    this.name = name;
  }

  setGender(gender: string): void {
    this.gender = gender;
  }

  setEmail(email: string): void {
    this.email = email;
  }

  setPassword(password: string): void {
    this.password = password;
  }
}

export default Profile;