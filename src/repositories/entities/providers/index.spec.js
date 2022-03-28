import assert from 'assert';

import ProvidersEntity from './index.js';

const callTracker = new assert.CallTracker();
process.on('exit', () => callTracker.verify());

const data = { name: 'Umbrella Corporation', code: 'UC', schema: { document: { type: "string", required: true } } };

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

  const providersEntity = new ProvidersEntity({ database: databaseStub });
  const id = '1';
  const result = providersEntity.get(id);
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

  const providersEntity = new ProvidersEntity({ database: databaseStub });
  const result = providersEntity.find();
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

  const providersEntity = new ProvidersEntity({ database: databaseStub });
  const result = providersEntity.create(data);
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

  const providersEntity = new ProvidersEntity({ database: databaseStub });
  const id = '1';
  const result = providersEntity.get(id);
  assert.deepStrictEqual(result, data);
}

// should find providers
{
  const spyFn = callTracker.calls(1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        find() { spyFn(); return [data]; },
      }
    }
  }

  const providersEntity = new ProvidersEntity({ database: databaseStub });
  const result = providersEntity.find();
  assert.deepStrictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], data);
}