import { MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { PartnerSchema } from './schemas';
import { Partner } from '../../../../src/@core/domain/entities/partner.entity';

describe('Schemas test', () => {
  let orm: MikroORM;

  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [PartnerSchema],
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      dbName: 'events',
      user: 'root',
      password: 'root',
      forceEntityConstructor: true,
    });
    await orm.schema.refreshDatabase();
  });
  afterEach(async () => {
    orm.close();
  });
  test('should create a partner', async () => {
    const em = orm.em.fork();
    const partner = Partner.create({ name: 'Blake Ingram' });
    em.persist(partner);
    await em.flush();
    em.clear();
    const partnersInDb = await em.findOne(Partner, { id: partner.id });

    expect(partnersInDb.equals(partner)).toBeTruthy();
  });
});
