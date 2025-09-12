import { Entity, PrimaryGeneratedColumn, Column, Index } from "typeorm";

@Entity()
export class Webhook {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "varchar", nullable: false })
  method: string;

  @Column({ type: "varchar", })
  path: string;

  @Column({ type: "varchar", })
  header: string;

  @Column({ type: "varchar" })
  secret: string

}
