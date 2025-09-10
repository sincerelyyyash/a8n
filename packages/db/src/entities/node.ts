import { Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Node {
  @PrimaryGeneratedColumn('uuid')
  id: string
}
