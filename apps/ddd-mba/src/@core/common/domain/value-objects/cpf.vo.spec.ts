import { Cpf, InvalidCpfError } from './cpf.vo';

describe('CPF Value Object', () => {
  test('should remove any non-digits from input', () => {
    const cpf = new Cpf('035.209.851-10');
    expect(cpf.value).toHaveLength(11);
    expect(/\d+/g.test(cpf.value));
  });

  test('should throw an error if not have 11 digits', () => {
    expect(() => new Cpf('123.123.123')).toThrow(InvalidCpfError);
  });

  test('should throw an error if all digits are same', () => {
    expect(() => new Cpf('000.000.000-00')).toThrow(InvalidCpfError);
  });
});
