import { Entity, Column, PrimaryGeneratedColumn, BaseEntity } from 'typeorm'

@Entity('users')
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
    id: string

  @Column()
    name: string

  @Column()
    email: string

  @Column()
    password: string
}
