import { DataSource } from "typeorm";
import { Node } from "./entities/node";
import { User } from "./entities/user";
import { Webhook } from "./entities/webhook";
import { Workflow } from "./entities/workflows";
import { Connection } from "./entities/connection";


export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "postgres",
  synchronize: true,
  logging: false,
  entities: [User, Webhook, Workflow, Node, Connection],
  subscribers: [],
  migrations: [],
})
