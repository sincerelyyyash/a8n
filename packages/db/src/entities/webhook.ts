import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Webhook {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  method: string;

  @Column()
  path: string;

  @Column()
  header: string;

  @Column()
  secret: string

}
