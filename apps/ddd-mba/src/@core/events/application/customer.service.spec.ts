import { EntityManager, MikroORM, MySqlDriver } from '@mikro-orm/mysql';
import { ICustomerRepository } from '../domain/repositories/customer-repository.interface';
import { CustomerSchema } from '../infra/db/schemas';
import { CustomerMySqlRepository } from '../infra/db/repositories/customer-mysql.repository';
import { Customer } from '../domain/entities/customer.entity';
import { CustomerService } from './customer.service';
import { IUnitOfWork } from '../../common/application/unit-of-work.interface';
import { UnitOfWorkMikroOrm } from '../../common/infra/unit-of-work-mikro-orm';
describe('Customer Service Test', () => {
  let orm: MikroORM;
  let entityManager: EntityManager;
  let customerRepository: ICustomerRepository;
  let unitOfWork: IUnitOfWork;
  let customerService: CustomerService;
  beforeEach(async () => {
    orm = await MikroORM.init<MySqlDriver>({
      entities: [CustomerSchema],
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
    customerRepository = new CustomerMySqlRepository(entityManager);
    entityManager.clear();
    await orm.schema.refreshDatabase();
    customerService = new CustomerService(customerRepository, unitOfWork);
  });
  afterEach(async () => {
    await orm.close();
  });

  test('Should list an empty array of customers', async () => {
    const result = await customerService.list();
    expect(result).toHaveLength(0);
  });

  test('Should list an array with one customer', async () => {
    const customer = Customer.create({
      name: 'Customer name',
      cpf: '03520985110',
    });
    await customerRepository.add(customer);
    await entityManager.flush();
    const result = await customerService.list();
    expect(result).toHaveLength(1);
  });

  test('Should register a customer', async () => {
    const customer = await customerService.register({
      name: 'Customer name',
      cpf: '03520985110',
    });
    const foundCustomer = await entityManager.findOne(Customer, {
      id: customer.id,
    });
    expect(customer.equals(foundCustomer)).toBeTruthy();
  });

  test('Should update a customer', async () => {
    const customer = Customer.create({
      name: 'Customer name',
      cpf: '03520985110',
    });
    await customerRepository.add(customer);
    await unitOfWork.commit();
    const updatedCustomer = await customerService.update(customer.id.value, {
      name: 'new customer name',
    });
    expect(customer.equals(updatedCustomer)).toBeTruthy();
    expect(updatedCustomer.name).toBe('new customer name');
  });

  test('Should throw an error when update nonexistent customer', async () => {
    const nonexistentCustomerId = '8f088c3e-baff-58e9-9294-4d976ccbd850';
    expect(() =>
      customerService.update(nonexistentCustomerId, { name: 'new name' }),
    ).rejects.toThrowError();
  });
});
