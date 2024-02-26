import { Repository } from 'typeorm';
import { User } from '../db/entities/User';
import { Inject, InjectRepository, Service } from '../provider';

@Service
export class UserService {
  @InjectRepository(User) userRepository: Repository<User>;
  //  @Inject(UserService) userService:UserService; // inject other service

  async findUserByEmail(email:string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async signUpUser(email:string, password:string, firstname:string, lastname:string) {
    let newUser = new User();
    newUser.email = email;
    newUser.password = password;
    newUser.firstname = firstname;
    newUser.lastname = lastname;
    return this.userRepository.save(newUser);
  }
}