import { Entity, Column, PrimaryGeneratedColumn, Index } from "typeorm";

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", length: 20, nullable: false })
  firstName: string

  @Column({ type: "varchar", length: 20, nullable: true })
  lastName: string

  @Column({ type: "varchar", length: 254, nullable: false })
  @Index({ unique: true })
  email: string

  @Column({ type: "varchar", nullable: false })
  password: string

}
