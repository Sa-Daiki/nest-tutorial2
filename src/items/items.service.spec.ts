import { Test } from '@nestjs/testing';
import { ItemsService } from './items.service';
import { ItemRepository } from './item.repository';
import { UserStatus } from '../auth/user-status.enum';
import { ItemStatus } from './item-status.enum';
import { BadRequestException, NotFoundException } from '@nestjs/common';

const mockItemRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  createItem: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
});

const mockUser1 = {
  id: '1',
  username: 'test1',
  password: '1234',
  status: UserStatus.PREMIUM,
};

const mockUser2 = {
  id: '2',
  username: 'test2',
  password: '1234',
  status: UserStatus.FREE,
};

describe('ItemsServiceTest', () => {
  let itemsService;
  let itemRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: ItemRepository,
          useFactory: mockItemRepository,
        },
      ],
    }).compile();

    itemsService = module.get<ItemsService>(ItemsService);
    itemRepository = module.get<ItemRepository>(ItemRepository);
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const expected = [];
      itemRepository.find = jest.fn().mockResolvedValue(expected);
      const result = await itemsService.findAll();
      expect(result).toEqual(expected);
    });
  });

  describe('findById', () => {
    it('should return an item', async () => {
      const expected = {
        id: 'test-id',
        name: 'PC',
        price: 500000,
        description: '',
        status: ItemStatus.ON_SALE,
        created_at: '',
        updated_at: '',
        userId: mockUser1.id,
        user: mockUser1,
      };

      itemRepository.findOne = jest.fn().mockResolvedValue(expected);
      const result = await itemsService.findById('test-id');
      expect(result).toEqual(expected);
    });
    it('should throw an error if item is not found', async () => {
      itemRepository.findOne.mockResolvedValue(null);
      expect(itemsService.findById('test-id')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  it('should create an item', async () => {
    const expected = {
      id: 'test-id',
      name: 'PC',
      price: 500000,
      description: '',
      status: ItemStatus.ON_SALE,
      created_at: '',
      updated_at: '',
      userId: mockUser1.id,
      user: mockUser1,
    };

    itemRepository.createItem.mockResolvedValue(expected);
    const result = await itemsService.create(
      {
        name: 'PC',
        price: 500000,
        description: '',
      },
      mockUser1,
    );
    expect(result).toEqual(expected);
  });

  describe('should update an item status', () => {
    const mockItem = {
      id: 'test-id',
      name: 'PC',
      price: 500000,
      description: '',
      status: ItemStatus.ON_SALE,
      created_at: '',
      updated_at: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('should update an item status', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.updateStatus('test-id', mockUser2);
      expect(itemRepository.save).toHaveBeenCalled();
    });

    it('should throw an error if item is not found', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      expect(itemsService.updateStatus('test-id', mockUser1)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('delete', () => {
    const mockItem = {
      id: 'test-id',
      name: 'PC',
      price: 500000,
      description: '',
      status: ItemStatus.ON_SALE,
      created_at: '',
      updated_at: '',
      userId: mockUser1.id,
      user: mockUser1,
    };
    it('should update an item status', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await itemsService.delete('test-id', mockUser1);
      expect(itemRepository.delete).toHaveBeenCalled();
    });

    it('should throw an error if item is not found', async () => {
      itemRepository.findOne.mockResolvedValue(mockItem);
      await expect(itemsService.delete('test-id', mockUser2)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
