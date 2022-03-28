import assert from 'assert';

import BeneficiariesService from './index.js';

const callTracker = new assert.CallTracker();
process.on('exit', () => callTracker.verify());

const data = { name: 'Maria Silva', company: '1', document: '092.221.235-68', plans: [{ provider: '1' }, { provider: '2' }] };
const MOCK_DATA = {
  "plans": ["1", "2"],
  "name": "Maria Silva",
  "document": "092.221.235-68",
  "company": "1"
}

// shouldn't return a value for an id that does not exist
{
  const spyFn = callTracker.calls(1);
  const repositoryStub = {
    get(id) { spyFn(id); return undefined; },
  }

  const beneficiariesService = new BeneficiariesService({ repository: repositoryStub });
  const id = '1';
  const result = beneficiariesService.get(id);
  assert.deepStrictEqual(result, undefined);
}

// shouldn't find values on an empty database
{
  const spyFn = callTracker.calls(1);
  const repositoryStub = {
    find() { spyFn(); return []; },
  }

  const beneficiariesService = new BeneficiariesService({ repository: repositoryStub });
  const result = beneficiariesService.find();
  assert.deepStrictEqual(result.length, 0);
}

// should throw an error when trying to create a beneficiary with an invalid document
{
  const companiesService = {
    get() {
      return {
        providers: ['1', '2'],
      }
    }
  }

  const planProvidersService = {
    repository: {
      validateProviderSchema() {
        throw new Error(`Validation Error: 'document' is not a number`)
      }
    },
    find() {
      return [{ id: '1', schema: { document: { type: "number" } } }, { id: '2', schema: {} }];
    },
  }

  const beneficiariesService = new BeneficiariesService({
    companies: companiesService,
    planProviders: planProvidersService
  });

  assert.rejects(
    () => new Promise((resolve) => resolve(beneficiariesService.create(MOCK_DATA))),
    { message: `Validation Error: 'document' is not a number` },
    'should throw an error when trying to create a beneficiary with an invalid document'
  )
}

// should create a new beneficiary
{
  const fn = (data) => {
    assert.deepStrictEqual(data.name, 'Maria Silva');
    assert.deepStrictEqual(data.document, '092.221.235-68');
    assert.deepStrictEqual(data.company, '1');
  }

  const spyFn = callTracker.calls(fn, 1);
  const repositoryStub = {
    createOrUpdate(receivedData) { spyFn(receivedData); return data; },
  }

  const companiesService = {
    get() {
      return {
        providers: ['1', '2'],
      }
    }
  }

  const planProvidersService = {
    repository: {
      validateProviderSchema() {
        return true;
      }
    },
    find() {
      return [{ id: '1', schema: {} }, { id: '2', schema: {} }];
    },
  }

  const beneficiariesService = new BeneficiariesService({
    repository: repositoryStub,
    companies: companiesService,
    planProviders: planProvidersService
  });
  const result = beneficiariesService.create(MOCK_DATA);
  assert.deepStrictEqual(result, data);
}

// should get a beneficiary with an id
{
  const fn = (id) => {
    assert.deepStrictEqual(id, '1');
  }

  const spyFn = callTracker.calls(fn, 1);
  const repositoryStub = {
    get(id) { spyFn(id); return data; }
  }

  const beneficiariesService = new BeneficiariesService({ repository: repositoryStub });
  const result = beneficiariesService.get('1');
  assert.deepStrictEqual(result, data);
}

// should find beneficiaries
{
  const spyFn = callTracker.calls(1);
  const repositoryStub = {
    find() { spyFn(); return [data]; }
  }

  const beneficiariesService = new BeneficiariesService({ repository: repositoryStub });
  const result = beneficiariesService.find();
  assert.deepStrictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], data);
}