import { Entity, PrimaryGeneratedColumn, Column, OneToMany, Index } from "typeorm";


@Entity()
export class Workflow {


  @PrimaryGeneratedColumn('uuid')
  id: string

  @Index({ unique: true })
  @Column({ length: 128 })
  name: string;

  @Column({ length: 32, nullable: false })
  title: string

  @Column({ length: 12, nullable: false })
  enabled: boolean

  @OneToMany(() => Node, (node) => node.id)
  nodes: Node[]

  @OneToMany(() => Connection, (connection) => connection.id)
  connection: Connection[]
}
