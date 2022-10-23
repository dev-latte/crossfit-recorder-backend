import { NotFoundException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "../models/user.entity";
import { UserService } from "./user.service";

describe("UserService", () => {
  let service: UserService;
  let userRepository: Repository<UserEntity>;
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
            delete: jest.fn()
          }
        }
      ]
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
    it("should call userRepository.create with correct params", async () => {
      // Mock Data
      const user = Object.assign({
        id: 1,
        name: "Mock Name",
        boxCode: "crossfit_test",
        level: 3
      });

      // add Mock Data
      const userRepositorySaveSpy = jest
        .spyOn(userRepository, "save")
        .mockResolvedValue(user);

      // Execution
      const result = await service.createUser(user);

      // test
      expect(userRepositorySaveSpy).toBeCalledWith(user);
      expect(result).toBe(user);
    });
  });

  describe("findOneUser", () => {
    /** Find One User, get User by ID */
    it("should return a user with id", async () => {
      // Mock Data
      const userId = 1;
      const user = Object.assign({
        id: userId,
        name: "Mock Name",
        boxCode: "crossfit_test",
        level: 3
      });

      // Add Mock data
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(user);

      // Execution
      const result = await service.findOneUser(userId);

      // test
      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: userId }
      });
      expect(result.name).toBe(user.name);
      expect(result.boxCode).toBe(user.boxCode);
      expect(result.level).toBe(user.level);
    });

    /** Find One User, NotFoundException */
    it("should return NotFoundException", async () => {
      const id = Number.MAX_SAFE_INTEGER;
      try {
        // Execution
        await service.findOneUser(id);
      } catch (e) {
        // test
        expect(e.message).toBe(`Not found Data by Id : ${id}.`);
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});
