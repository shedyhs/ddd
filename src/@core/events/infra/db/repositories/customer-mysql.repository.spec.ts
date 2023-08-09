import { MikroORM, EntityManager } from '@mikro-orm/mysql';
import { MySqlDriver } from '@mikro-orm/mysql';
import { Customer } from '../../../domain/entities/customer.entity';
import { ICustomerRepository } from '../../../domain/repositories/customer-repository.interface';
import { CustomerSchema } from '../schemas';
import { CustomerMySqlRepository } from './customer-mysql.repository';

describe('Customer MySql repository', () => {
  let orm: MikroORM;
  let entityManager: EntityManager;
  let customerRepository: ICustomerRepository;
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
    customerRepository = new CustomerMySqlRepository(entityManager);
    entityManager.clear();
    await orm.schema.refreshDatabase();
  });
  afterEach(async () => {
    await orm.close();
  });
  
  test('Should add a customer in database', async () => {
    const customer = Customer.create({
      name: 'Ryan Ramirez',
      cpf: '996.109.540-57',
    });
    await customerRepository.add(customer);
    await entityManager.flush();
    entityManager.clear();
    const [customersInDb, numberOfCustomersInDb] =
      await entityManager.findAndCount(Customer, {
        id: customer.id,
      });
    expect(numberOfCustomersInDb).toBe(1);
    expect(customersInDb[0].equals(customer)).toBeTruthy();
  });

  test('find by id should return customer in db', async () => {
    const customer = Customer.create({
      name: 'Ryan Ramirez',
      cpf: '996.109.540-57',
    });
    await customerRepository.add(customer);
    await entityManager.flush();
    entityManager.clear();
    const foundCustomer = await customerRepository.findById(customer.id);
    expect(customer.equals(foundCustomer)).toBeTruthy();
  });

  test('find by nonenxistent id in database should return nullish', async () => {
    const nonenxistentCustomerId = 'dcc564b5-9737-5882-9f20-1616350ee8ea';
    const foundCustomer = await customerRepository.findById(
      nonenxistentCustomerId,
    );
    expect(foundCustomer).toBeNull();
  });

  test('Should update a customer in database', async () => {
    const customer = Customer.create({
      name: 'Ryan Ramirez',
      cpf: '996.109.540-57',
    });
    await customerRepository.add(customer);
    await entityManager.flush();
    entityManager.clear();
    customer.changeName('Lizzie Matthews');
    await customerRepository.add(customer);
    await entityManager.flush();
    entityManager.clear();
    const foundCustomer = await customerRepository.findById(customer.id);
    expect(customer.equals(foundCustomer)).toBeTruthy();
    expect(foundCustomer.name).toBe('Lizzie Matthews');
  });

  test('find all should return all customers in db', async () => {
    const customer = Customer.create({
      name: 'customer name',
      cpf: '996.109.540-57',
    });
    await customerRepository.add(customer);
    const anotherCustomer = Customer.create({
      name: 'another customer name',
      cpf: '35774198065',
    });
    await customerRepository.add(anotherCustomer);
    await entityManager.flush();
    entityManager.clear();
    const foundCustomers = await customerRepository.findAll();
    expect(foundCustomers).toHaveLength(2);
    foundCustomers.map((customer) => {
      expect(customer).toBeInstanceOf(Customer);
    });
  });

  test('delete should remove customer from db', async () => {
    const customer = Customer.create({
      name: 'Ryan Ramirez',
      cpf: '996.109.540-57',
    });
    await customerRepository.add(customer);
    await entityManager.flush();
    entityManager.clear();
    let customersInDb = await entityManager.count(Customer);
    expect(customersInDb).toBe(1);
    await customerRepository.delete(customer);
    await entityManager.flush();
    customersInDb = await entityManager.count(Customer);
    expect(customersInDb).toBe(0);
  });
});
