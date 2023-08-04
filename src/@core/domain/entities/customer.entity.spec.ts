import { Cpf } from '../../common/domain/value-objects/cpf.vo';
import { Customer, CustomerId } from './customer.entity';

test('should create a customer', () => {
  const customer = Customer.create({
    name: 'Ronnie Jones',
    cpf: '035.209.851-10',
  });
  expect(customer).toBeInstanceOf(Customer);
  expect(customer.id).toBeDefined();
  expect(customer.id).toBeInstanceOf(CustomerId);
  expect(customer.cpf.value).toBe('03520985110');
  expect(customer.name).toBe('Ronnie Jones');
});

test('should verify if id is equals', () => {
  const firstInstance = Customer.create({
    cpf: '03520985110',
    name: 'shedy husein sinkoc',
  });

  const secondInstance = new Customer({
    id: firstInstance.id.value,
    cpf: new Cpf('225.448.060-01'),
    name: 'Effie Gross',
  });

  expect(firstInstance.equals(secondInstance)).toBeTruthy();
});
