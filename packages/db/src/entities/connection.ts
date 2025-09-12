import { Entity, PrimaryGeneratedColumn, OneToMany } from "typeorm"
import { Node } from "./node"

@Entity()
export class Connection {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => Node, (node) => node.id)
  from: Node[]

  @OneToMany(() => Node, (node) => node.id)
  to: Node[]

}
