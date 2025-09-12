import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { Connection } from "./connection";


@Entity()
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string


  @Column('simple-json')
  position: {
    x: string,
    y: string,
  }

  @OneToMany(() => Connection, (connection) => connection.id)
  connection: Connection[]
}
