import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../models/user.entity";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;
  let userRepositorySaveSpy;
  const mockUser = Object.assign({
    id: 1,
    name: "Mock Name",
    boxCode: "crossfit_test",
    level: 3,
  });
  const USER_REPOSITORY_TOKEN = getRepositoryToken(UserEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: USER_REPOSITORY_TOKEN,
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<Repository<UserEntity>>(USER_REPOSITORY_TOKEN);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("userRepository should be defined", () => {
    expect(userRepository).toBeDefined();
  });

  describe("createUser", () => {
    it("should call userRepository.create with correct params.", async () => {
      // add save method
      userRepositorySaveSpy = jest
        .spyOn(userRepository, "save")
        .mockResolvedValue(mockUser);

      // Execution
      const result = await service.createUser(mockUser);

      // test
      expect(userRepositorySaveSpy).toBeCalledWith(mockUser);
      expect(result).toBe(mockUser);
    });
  });

  describe("findAllUsers", () => {
    it("should return All user, If there are users in database.", async () => {
      // Mock Data
      const user1 = {
        id: 2,
        name: "Beginner",
        boxCode: "crossfit_baram",
        level: 1,
        registrationDate: new Date(),
      };

      const user2 = {
        id: 3,
        name: "Pro",
        boxCode: "crossfit_sun",
        level: 5,
        registrationDate: new Date(),
      };

      // add find method
      userRepositorySaveSpy = jest
        .spyOn(userRepository, "find")
        .mockResolvedValue([user1, user2]);

      // Execution
      const result = await service.findAllUsers();

      // test
      expect(userRepositorySaveSpy).toBeCalledTimes(1);
      expect(result).toHaveLength(2);

      const resultUser2 = result.pop();
      expect(resultUser2.id).toBe(user2.id);
      expect(resultUser2.name).toBe(user2.name);
      expect(resultUser2.boxCode).toBe(user2.boxCode);
      expect(resultUser2.level).toBe(user2.level);
      expect(resultUser2.registrationDate).toBe(user2.registrationDate);

      const resultUser1 = result.pop();
      expect(resultUser1.id).toBe(user1.id);
      expect(resultUser1.name).toBe(user1.name);
      expect(resultUser1.boxCode).toBe(user1.boxCode);
      expect(resultUser1.level).toBe(user1.level);
      expect(resultUser1.registrationDate).toBe(user1.registrationDate);
    });

    it("should return NotFoundException, If there are not users in database.", async () => {
      try {
        // Execution
        await service.findAllUsers();
        throw new Error("[Find All USers] it should not reach here.");
      } catch (e) {
        // test
        expect(e.message).toBe(`No Data of All Users.`);
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("findOneUser", () => {
    /** Find One User, get User by ID */
    it("should return a user with id.", async () => {
      const userId = 1;

      // Add findOne method
      userRepositorySaveSpy = jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(mockUser);

      // Execution
      const result = await service.findOneUser(userId);

      // test
      expect(userRepositorySaveSpy).toBeCalledWith({
        where: { id: userId },
      });
      expect(result.name).toBe(mockUser.name);
      expect(result.boxCode).toBe(mockUser.boxCode);
      expect(result.level).toBe(mockUser.level);
    });

    /** Find One User, NotFoundException */
    it("should return NotFoundException, If Don't search user by id.", async () => {
      const id = Number.MAX_SAFE_INTEGER;
      try {
        // Execution
        await service.findOneUser(id);
        throw new Error("[FindOneUser] it should not reach here.");
      } catch (e) {
        // test
        expect(e.message).toBe(`Not found Data by Id : ${id}.`);
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("updateUser", () => {
    const updateUser = {
      name: "Mock Name For Update",
      boxCode: "new Box",
      level: 5,
    };

    it("should return result, if success user updated.", async () => {
      const updateUserId = mockUser.id;
      // add findOneUser method
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

      // add update method
      userRepositorySaveSpy = jest
        .spyOn(userRepository, "update")
        .mockResolvedValue(
          Object.assign({
            generatedMaps: [],
            raw: [],
            affected: 1,
          }),
        );

      // Execution
      const result = await service.updateUser(updateUserId, updateUser);

      // test
      expect(userRepositorySaveSpy).toBeCalledWith(updateUserId, updateUser);
      expect(result.affected).toBe(1);
    });

    it("should return NotFoundException, if failed search user by ID.", async () => {
      const updateUserId = Number.MAX_SAFE_INTEGER;
      // add update method
      jest.spyOn(userRepository, "update");
      try {
        // Execution
        await service.updateUser(updateUserId, updateUser);
        throw new Error("[Update User] it should not reach here.");
      } catch (error) {
        // test
        expect(error.message).toBe(`Not found Data by Id : ${updateUserId}.`);
        expect(error).toBeInstanceOf(NotFoundException);
      }
    });
  });

  describe("deleteUser", () => {
    it("should return result , if success delete user.", async () => {
      // add findOneUser method
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);

      // add update method
      userRepositorySaveSpy = jest
        .spyOn(userRepository, "delete")
        .mockResolvedValue(
          Object.assign({
            raw: [],
            affected: 1,
          }),
        );

      // Execution
      const result = await service.deleteUser(mockUser.id);

      // test
      expect(userRepositorySaveSpy).toBeCalledWith(mockUser.id);
      expect(result.affected).toBe(1);
    });
  });

  it("should return NotFoundException, if failed search user by ID.", async () => {
    const deleteUserId = Number.MAX_SAFE_INTEGER;
    // add update method
    jest.spyOn(userRepository, "delete");

    try {
      // Execution
      await service.deleteUser(deleteUserId);
      throw new Error("[Delete User] it should not reach here.");
    } catch (error) {
      // test
      expect(error.message).toBe(`Not found Data by Id : ${deleteUserId}.`);
      expect(error).toBeInstanceOf(NotFoundException);
    }
  });
});
