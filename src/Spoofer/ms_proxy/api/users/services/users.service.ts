import UsersDao from "../daos/users.dao.js";
import { CRUD } from "../../common/interfaces/crud.interface.js";
import { CreateUserDto } from "../dto/create.user.dto.js";
import { PutUserDto } from "../dto/put.user.dto.js";
import { PatchUserDto } from "../dto/patch.user.dto.js";

class UsersService implements CRUD {
  async create(resource: CreateUserDto) {
    return UsersDao.addUser(resource);
  }

  async deleteById(id: string) {
    return UsersDao.removeUserById(id);
  }

  async list(limit: number, page: number) {
    return UsersDao.getUsers();
  }

  async patchById(id: string, resource: PatchUserDto) {
    return UsersDao.patchUserById(id, resource);
  }

  async readById(id: string) {
    return UsersDao.getUserById(id);
  }

  async putById(id: string, resource: PutUserDto) {
    return UsersDao.putUserById(id, resource);
  }

  async getUserByEmail(email: string) {
    return UsersDao.getUserByEmail(email);
  }
}

export default new UsersService();
