import assert from 'assert';

import CompaniesEntity from './index.js';

const callTracker = new assert.CallTracker();
process.on('exit', () => callTracker.verify());

const data = { name: 'Duck Duck GO', providers: ['1', '2'] };

// shouldn't return a value for an id that does not exist
{
  const spyFn = callTracker.calls(1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        get(id) { spyFn(id); return undefined; },
      }
    }
  }

  const companiesEntity = new CompaniesEntity({ database: databaseStub });
  const id = '1';
  const result = companiesEntity.get(id);
  assert.deepStrictEqual(result, undefined);
}

// shouldn't find values on an empty database
{
  const spyFn = callTracker.calls(1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        find() { spyFn(); return []; },
      }
    }
  }

  const companiesEntity = new CompaniesEntity({ database: databaseStub });
  const result = companiesEntity.find();
  assert.deepStrictEqual(result.length, 0);
}

// should create a new company
{
  const spyFn = callTracker.calls(1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        create(data) { spyFn(); return data; },
      }
    }
  }

  const companiesEntity = new CompaniesEntity({ database: databaseStub });
  const result = companiesEntity.create(data);
  assert.deepStrictEqual(result, data);
}

// should get a company by id
{
  const fn = (id) => {
    assert.deepStrictEqual(id, '1');
  }

  const spyFn = callTracker.calls(fn, 1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        get(id) { spyFn(id); return data; },
      }
    }
  }

  const companiesEntity = new CompaniesEntity({ database: databaseStub });
  const id = '1';
  const result = companiesEntity.get(id);
  assert.deepStrictEqual(result, data);
}

// should find companies
{
  const spyFn = callTracker.calls(1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        find() { spyFn(); return [data]; },
      }
    }
  }

  const companiesEntity = new CompaniesEntity({ database: databaseStub });
  const result = companiesEntity.find();
  assert.deepStrictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], data);
}