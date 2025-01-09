import { Repository } from 'typeorm';
import { User, UserRole } from '../db/entities/User';
import { Inject, InjectRepository, Service } from '../provider';

@Service
export class UserService {
  @InjectRepository(User) userRepository: Repository<User>;
  //  @Inject(UserService) userService:UserService; // inject other service

  async findUserByEmail(email:string) {
    return this.userRepository.findOne({ where: { email } });
  }

  async createUser(data: { email: string; password: string; firstName: string; lastName: string }) {
    const user = new User();
    user.email = data.email;
    user.password = data.password;
    user.firstname = data.firstName;
    user.lastname = data.lastName;
    user.role = UserRole.USER;

    const savedUser = await this.userRepository.save(user);

    // Convert the saved user to a plain object
    return {
      id: savedUser.id,
      email: savedUser.email,
      firstname: savedUser.firstname,
      lastname: savedUser.lastname,
      role: savedUser.role,
    };
  }

  async getTotalEmployees(): Promise<number> {
    return this.userRepository.count();
  }
}