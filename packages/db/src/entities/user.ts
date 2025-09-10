import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, nullable: false })
  firstName: string

  @Column({ length: 20, nullable: true })
  lastName: string

  @Column({ length: 254, nullable: false })
  @Index({ unique: true })
  email: string

  @Column({ type: String, nullable: false })
  password: string

}
