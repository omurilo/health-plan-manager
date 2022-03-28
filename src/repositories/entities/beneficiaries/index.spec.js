import assert from 'assert';

import BeneficiariesEntity from './index.js';

const callTracker = new assert.CallTracker();
process.on('exit', () => callTracker.verify());

const data = { name: 'Murilo Alves', company: '1', document: '12345678901', plans: ['1', '2'] };

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

  const beneficiariesEntity = new BeneficiariesEntity({ database: databaseStub });
  const id = '1';
  const result = beneficiariesEntity.get(id);
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

  const beneficiariesEntity = new BeneficiariesEntity({ database: databaseStub });
  const result = beneficiariesEntity.find();
  assert.deepStrictEqual(result.length, 0);
}

// should create a new beneficiary
{
  const spyFn = callTracker.calls(1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        create(data) { spyFn(); return data; },
      }
    }
  }

  const beneficiariesEntity = new BeneficiariesEntity({ database: databaseStub });
  const result = beneficiariesEntity.create(data);
  assert.deepStrictEqual(result, data);
}

// should create a new beneficiary when it cannot find an equivalent
{
  const spyFn = callTracker.calls(2);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        create(data) { spyFn(); return data; },
        find() { spyFn(); return []; }
      }
    }
  }

  const beneficiariesEntity = new BeneficiariesEntity({ database: databaseStub });
  const result = beneficiariesEntity.createOrUpdate(data);
  assert.deepStrictEqual(result, data);
}

// should update a beneficiary when it has been exist
{
  const fn = (id) => {
    assert.deepStrictEqual(id, '1');
  }

  const spyFn = callTracker.calls(2);
  const spyFindOnCreate = callTracker.calls(fn, 1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        instance: {
          set(data) { spyFn(); },
          get(id) { spyFindOnCreate(id); return data; }
        },
        find() { spyFn(); return [{ id: '1', ...data }]; }
      }
    }
  }

  const beneficiariesEntity = new BeneficiariesEntity({ database: databaseStub });
  const result = beneficiariesEntity.createOrUpdate(data);
  assert.deepStrictEqual(result, data);
}

// should get a beneficiary with an id
{
  const fn = (id) => {
    assert.deepStrictEqual(id, '1');
  }

  const spyFn = callTracker.calls(fn, 1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        get(id) { spyFn(id); return data; }
      }
    }
  }

  const beneficiariesEntity = new BeneficiariesEntity({ database: databaseStub });
  const result = beneficiariesEntity.get('1');
  assert.deepStrictEqual(result, data);
}

// should find beneficiaries
{
  const spyFn = callTracker.calls(1);
  const databaseStub = {
    getEntityDatabaseInstance() {
      return {
        find() { spyFn(); return [data]; }
      }
    }
  }

  const beneficiariesEntity = new BeneficiariesEntity({ database: databaseStub });
  const result = beneficiariesEntity.find();
  assert.deepStrictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], data);
}