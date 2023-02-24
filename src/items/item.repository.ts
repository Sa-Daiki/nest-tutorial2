import { Item } from '../entities/item.entity';
import { EntityRepository, Repository } from 'typeorm';
import { CreateItemDto } from './dto/create-item.dto';
import { ItemStatus } from './item-status.enum';

@EntityRepository(Item)
export class ItemRepository extends Repository<Item> {
  async createItem(createItemDto: CreateItemDto) {
    const item = this.create({
      ...createItemDto,
      status: ItemStatus.ON_SALE,
      createdAt: new Date().toString(),
      updatedAt: new Date().toString(),
    });
    await this.save(item);

    return item;
  }
}
