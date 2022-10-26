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
    it("should call userRepository.create with correct params", async () => {
      // add Mock Data
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
    it("should return All user, If there are users in database", async () => {
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

      userRepositorySaveSpy = jest
        .spyOn(userRepository, "find")
        .mockResolvedValue([user1, user2]);

      // Execution
      const result = await service.findAllUsers();

      // test
      expect(result.length).toBe(2);
    });

    // it("should return NotFoundException, If there are not users in database", async () => {});
  });

  describe("findOneUser", () => {
    /** Find One User, get User by ID */
    it("should return a user with id", async () => {
      const userId = 1;

      // Add Mock data
      const userRepositoryFindOneSpy = jest
        .spyOn(userRepository, "findOne")
        .mockResolvedValue(mockUser);

      // Execution
      const result = await service.findOneUser(userId);

      // test
      expect(userRepositoryFindOneSpy).toHaveBeenCalledWith({
        where: { id: userId },
      });
      expect(result.name).toBe(mockUser.name);
      expect(result.boxCode).toBe(mockUser.boxCode);
      expect(result.level).toBe(mockUser.level);
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
