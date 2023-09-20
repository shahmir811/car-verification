import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(name: string, email: string, password: string) {
    // check if the email is already in use
    const users = await this.usersService.find(email);

    if (users.length) {
      throw new BadRequestException('Email already in use');
    }

    // Hash the incoming user's password
    const salt = randomBytes(8).toString('hex'); // 16 characters/number long string
    const hash = (await scrypt(password, salt, 32)) as Buffer;
    const hashedPassword = salt + '.' + hash.toString('hex');

    // Create a new user and save it in the db
    const user = await this.usersService.create(name, email, hashedPassword);

    // Return the user
    return user;
  }

  async signin(email: string, password: string) {
    const [user] = await this.usersService.find(email);

    if (!user) throw new NotFoundException('User not found');

    // comparing passwords
    const [salt, storedPassword] = user.password.split('.');
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (hash.toString('hex') !== storedPassword)
      throw new BadRequestException('Incorrect password');

    return user;
  }
}
