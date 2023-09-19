import {
  AfterInsert,
  AfterRemove,
  AfterUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @AfterInsert()
  logInsert() {
    console.log(`New user name ${this.name} is created`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log(`Updated user with id: ${this.id}`);
  }

  @AfterRemove()
  logRemoved() {
    console.log(`Removed user with id: ${this.id}`);
  }
}
