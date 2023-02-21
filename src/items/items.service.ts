import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { Item } from 'src/entities/item.entity';
import { ItemRepository } from './item.repository';
import { ItemStatus } from './item-status.enum';

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

  async updateStatus(id: string): Promise<Item> {
    const item = await this.findById(id);
    if (!item) throw new NotFoundException();

    const updatedItem = {
      ...item,
      status: ItemStatus.SOLD_OUT,
      updatedAt: new Date().toISOString(),
    };
    await this.itemRepository.save(updatedItem);
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    this.itemRepository.delete({ id });
  }
}
