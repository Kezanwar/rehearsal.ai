import { users } from "@src/db/schema";

type User = typeof users.$inferSelect;

export default class UserCache {
  private static users = new Map<string, User>();

  static get(uuid: string) {
    return this.users.get(uuid);
  }

  static set(user: User) {
    this.users.set(user.uuid, user);
  }

  static remove(uuid: string) {
    this.users.delete(uuid);
  }
}
