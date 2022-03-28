import assert from 'assert';

import CompaniesServices from './index.js';

const callTracker = new assert.CallTracker();
process.on('exit', () => callTracker.verify());

const data = { name: 'Duck Duck GO', providers: ['1', '2'] };

// shouldn't return a value for an id that does not exist
{
  const spyFn = callTracker.calls(1);
  const repositoryStub = {
    get(id) { spyFn(id); return undefined; },
  }

  const companiesService = new CompaniesServices({ repository: repositoryStub });
  const id = '1';
  const result = companiesService.get(id);
  assert.deepStrictEqual(result, undefined);
}

// shouldn't find values on an empty database
{
  const spyFn = callTracker.calls(1);
  const repositoryStub = {
    find() { spyFn(); return []; },
  }

  const companiesService = new CompaniesServices({ repository: repositoryStub });
  const result = companiesService.find();
  assert.deepStrictEqual(result.length, 0);
}

// should create a new company
{
  const spyFn = callTracker.calls(1);
  const repositoryStub = {
    create(data) { spyFn(); return data; },
  }

  const companiesService = new CompaniesServices({ repository: repositoryStub });
  const result = companiesService.create(data);
  assert.deepStrictEqual(result, data);
}

// should get a company by id
{
  const fn = (id) => {
    assert.deepStrictEqual(id, '1');
  }

  const spyFn = callTracker.calls(fn, 1);
  const repositoryStub = {
    get(id) { spyFn(id); return data; },
  }

  const companiesService = new CompaniesServices({ repository: repositoryStub });
  const id = '1';
  const result = companiesService.get(id);
  assert.deepStrictEqual(result, data);
}

// should find companies
{
  const spyFn = callTracker.calls(1);
  const repositoryStub = {
    find() { spyFn(); return [data]; },
  }

  const companiesService = new CompaniesServices({ repository: repositoryStub });
  const result = companiesService.find();
  assert.deepStrictEqual(result.length, 1);
  assert.deepStrictEqual(result[0], data);
}