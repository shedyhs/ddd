import { MikroORM, EntityManager, MySqlDriver } from '@mikro-orm/mysql';
import { Partner } from '../../../domain/entities/partner.entity';
import { IPartnerRepository } from '../../../domain/repositories/partner-repository.interface';
import { PartnerSchema } from '../schemas';
import { PartnerMySqlRepository } from './partner-mysql.repository';

describe('Partner MySql repository', () => {
  let orm: MikroORM;
  let entityManager: EntityManager;
  let partnerRepository: IPartnerRepository;
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
    entityManager.clear();
    partnerRepository = new PartnerMySqlRepository(entityManager);
    await orm.schema.refreshDatabase();
  });

  afterEach(async () => {
    await orm.close();
  });

  test('Should add a partner in database', async () => {
    const partner = Partner.create({ name: 'Nettie Fisher' });
    await partnerRepository.add(partner);
    await entityManager.flush();
    entityManager.clear();
    const [partnersInDb, numberOfPartnersInDb] =
      await entityManager.findAndCount(Partner, {
        id: partner.id,
      });
    expect(numberOfPartnersInDb).toBe(1);
    expect(partnersInDb[0].equals(partner)).toBeTruthy();
  });

  test('Should add a partner in database', async () => {
    const partner = Partner.create({ name: 'Nettie Fisher' });
    await partnerRepository.add(partner);
    await entityManager.flush();
    entityManager.clear();
    const [partnersInDb, numberOfPartnersInDb] =
      await entityManager.findAndCount(Partner, {
        id: partner.id,
      });
    expect(numberOfPartnersInDb).toBe(1);
    expect(partnersInDb[0].equals(partner)).toBeTruthy();
  });

  test('find by id should return partner in db', async () => {
    const partner = Partner.create({ name: 'Charlie Schwartz' });
    await partnerRepository.add(partner);
    await entityManager.flush();
    entityManager.clear();
    const foundPartner = await partnerRepository.findById(partner.id);
    expect(partner.equals(foundPartner)).toBeTruthy();
  });

  test('find by nonenxistent id in database should return nullish', async () => {
    const nonenxistentPartnerId = 'dcc564b5-9737-5882-9f20-1616350ee8ea';
    const foundPartner = await partnerRepository.findById(
      nonenxistentPartnerId,
    );
    expect(foundPartner).toBeNull();
  });

  test('Should update a partner in database', async () => {
    const partner = Partner.create({ name: 'Nettie Fisher' });
    await partnerRepository.add(partner);
    await entityManager.flush();
    entityManager.clear();
    partner.changeName('Lizzie Matthews');
    await partnerRepository.add(partner);
    await entityManager.flush();
    entityManager.clear();
    const foundPartner = await partnerRepository.findById(partner.id);
    expect(partner.equals(foundPartner)).toBeTruthy();
    expect(foundPartner.name).toBe('Lizzie Matthews');
  });

  test('find all should return all partners in db', async () => {
    const partner = Partner.create({ name: 'Charlie Schwartz' });
    await partnerRepository.add(partner);
    const anotherPartner = Partner.create({ name: 'Jeff Casey' });
    await partnerRepository.add(anotherPartner);
    await entityManager.flush();
    entityManager.clear();
    const foundPartners = await partnerRepository.findAll();
    expect(foundPartners).toHaveLength(2);
    foundPartners.map((partner) => {
      expect(partner).toBeInstanceOf(Partner);
    });
  });

  test('delete should remove partner from db', async () => {
    const partner = Partner.create({ name: 'Nettie Fisher' });
    await partnerRepository.add(partner);
    await entityManager.flush();
    entityManager.clear();
    let partnersInDb = await entityManager.count(Partner);
    expect(partnersInDb).toBe(1);
    await partnerRepository.delete(partner);
    await entityManager.flush();
    partnersInDb = await entityManager.count(Partner);
    expect(partnersInDb).toBe(0);
  });

  test('delete should throw an error when remove nonexistent partner', async () => {
    const partner = Partner.create({ name: 'Nettie Fisher' });
    let partnersInDb = await entityManager.count(Partner);
    expect(partnersInDb).toBe(0);
    await partnerRepository.delete(partner);
    await entityManager.flush();
    partnersInDb = await entityManager.count(Partner);
    expect(partnersInDb).toBe(0);
  });
});
