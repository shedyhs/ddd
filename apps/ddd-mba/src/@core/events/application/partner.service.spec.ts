import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { IPartnerRepository } from '../domain/repositories/partner-repository.interface';
import { PartnerSchema } from '../infra/db/schemas';
import { PartnerMySqlRepository } from '../infra/db/repositories/partner-mysql.repository';
import { Partner } from '../domain/entities/partner.entity';
import { PartnerService } from './partner.service';
import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { UnitOfWorkMikroOrm } from '../../common/infra/unit-of-work-mikro-orm';
describe('Partner Service Test', () => {
  let orm: MikroORM;
  let entityManager: EntityManager;
  let partnerRepository: IPartnerRepository;
  let unitOfWork: IUnitOfWork;
  let partnerService: PartnerService;
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
    entityManager = orm.em.fork();
    unitOfWork = new UnitOfWorkMikroOrm(entityManager);
    partnerRepository = new PartnerMySqlRepository(entityManager);
    entityManager.clear();
    await orm.schema.refreshDatabase();
    partnerService = new PartnerService(partnerRepository, unitOfWork);
  });
  afterEach(async () => {
    await orm.close();
  });

  test('Should list an empty array of partners', async () => {
    const result = await partnerService.list();
    expect(result).toHaveLength(0);
  });

  test('Should list an array with one partner', async () => {
    const partner = Partner.create({
      name: 'Partner name',
    });
    await partnerRepository.add(partner);
    await entityManager.flush();
    const result = await partnerService.list();
    expect(result).toHaveLength(1);
  });

  test('Should register a partner', async () => {
    const partner = await partnerService.register({
      name: 'Partner name',
    });
    const foundPartner = await entityManager.findOne(Partner, {
      id: partner.id,
    });
    expect(partner.equals(foundPartner));
  });

  test('Should update a partner', async () => {
    const partner = Partner.create({
      name: 'Partner name',
    });
    await partnerRepository.add(partner);
    await unitOfWork.commit();
    const updatedPartner = await partnerService.update(partner.id.value, {
      name: 'new partner name',
    });
    expect(partner.equals(updatedPartner)).toBeTruthy();
    expect(updatedPartner.name).toBe('new partner name');
  });

  test('should throw an error when update a nonexistent partner', async () => {
    const nonexistentPartnerId = '60aa2827-d778-55d1-a79a-7e9e61de2b4f';
    expect(() =>
      partnerService.update(nonexistentPartnerId, {
        name: 'new partner name',
      }),
    ).rejects.toThrowError();
  });
});
