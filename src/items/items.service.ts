import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from '../entities/item.entity';
import { ItemRepository } from './item.repository';
import { ItemStatus } from './item-status.enum';
import { User } from '../entities/user.entity';

@Injectable()
export class ItemsService {
  constructor(private readonly itemRepository: ItemRepository) {}
  itemList: Item[] = [];

  async findAll(): Promise<Item[]> {
    return this.itemRepository.find();
  }

  async findById(id: string): Promise<Item> {
    const found = await this.itemRepository.findOne(id);
    if (!found) throw new NotFoundException();
    return found;
  }

  async create(createItemDto: CreateItemDto): Promise<Item> {
    return await this.itemRepository.createItem(createItemDto);
  }

  async updateStatus(id: string, user: User): Promise<Item> {
    const item = await this.findById(id);
    if (!item) throw new NotFoundException();

    const updatedItem = {
      ...item,
      status: ItemStatus.SOLD_OUT,
      updatedAt: new Date().toISOString(),
    };
    if (item.userId === user.id)
      throw new BadRequestException('自身の商品を購入することはできません');
    await this.itemRepository.save(updatedItem);
    return updatedItem;
  }

  async delete(id: string, user: User): Promise<void> {
    const item = await this.findById(id);
    if (item.userId !== user.id)
      throw new BadRequestException('他人の商品を削除することはできません。');
    this.itemRepository.delete({ id });
  }
}
