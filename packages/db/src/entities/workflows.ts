import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm";
import { Node } from "./node"
import { Connection } from "./connection";

@Entity()
export class Workflow {


  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ type: "varchar", length: 128 })
  name: string;

  @Column({ type: "varchar", length: 32, nullable: false })
  title: string

  @Column({ type: "varchar", length: 12, nullable: false })
  enabled: boolean

  @OneToMany(() => Node, (node) => node.id)
  nodes: Node[]

  @OneToMany(() => Connection, (connection) => connection.id)
  connection: Connection[]
}
