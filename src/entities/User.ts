import {BaseEntity} from "./BaseEntity";
import {Entity, Property} from "@mikro-orm/core";

@Entity()
export class User extends BaseEntity {
  constructor() {
    super();
  }

  @Property()
  username!: string;

  @Property({
    unique: true
  })
  email!: string;

  @Property()
  password!: string;

  @Property()
  role!: string;

  miniUser() {
    return {
      id: this.id.toString(),
      username: this.username,
      role: this.role,
      email: this.email,
    }
  }
}