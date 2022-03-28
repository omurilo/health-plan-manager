import assert from 'assert';
import supertest from 'supertest';

import server from '../server.js';

const COMPANY_ID = '6a93b22c-d2a2-4c7e-854b-4aee1d38c1a0';
const PROVIDER_ID = '6cd50011-5525-4e74-ab7a-0b39acb0774d';

// should get list of /GET companies
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = '/companies';

  const { status, body } = await request.get(url);
  assert.deepStrictEqual(status, 200);
  assert.deepStrictEqual(Array.isArray(body), true);
  assert.deepStrictEqual(body.length, 2);
  assert.deepStrictEqual(body[0].id, COMPANY_ID);
  assert.deepStrictEqual(body[0].name, 'Acme Co');
  assert.deepStrictEqual(body[0].providers.length, 2);
}

// should get list of /GET providers
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = '/providers';

  const { status, body } = await request.get(url);
  assert.deepStrictEqual(status, 200);
  assert.deepStrictEqual(Array.isArray(body), true);
  assert.deepStrictEqual(body.length, 4);
  assert.deepStrictEqual(body[0].id, PROVIDER_ID);
}

// should get empty array of /GET beneficiaries
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = '/beneficiaries';

  const { status, body } = await request.get(url);
  assert.deepStrictEqual(status, 200);
  assert.deepStrictEqual(body, []);
}

// should retrieve company by id /GET companies/:id
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = `/companies/${COMPANY_ID}`;

  const { status, body } = await request.get(url);
  assert.deepStrictEqual(status, 200);
  assert.deepStrictEqual(typeof body, 'object');
  assert.deepStrictEqual(body.id, COMPANY_ID);
  assert.deepStrictEqual(body.name, 'Acme Co');
  assert.deepStrictEqual(body.providers.length, 2);
}

// should retrieve provider by id /GET providers/:id
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = `/providers/${PROVIDER_ID}`;

  const { status, body } = await request.get(url);
  assert.deepStrictEqual(status, 200);
  assert.deepStrictEqual(typeof body, 'object');
  assert.deepStrictEqual(body.id, PROVIDER_ID);
}

// should create a company /POST companies
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = '/companies';

  const data = {
    name: 'Acme Co',
    providers: ["102c482f-1a78-4a22-80fe-d6c346f2d22f"]
  };

  const { status, body } = await request.post(url).send(data);
  assert.deepStrictEqual(status, 201);
  assert.deepStrictEqual(typeof body, 'object');
  assert.deepStrictEqual(typeof body.id, 'string');
  assert.deepStrictEqual(body.name, 'Acme Co');
  assert.deepStrictEqual(body.providers.length, 1);
  assert.deepStrictEqual(body.providers[0], "102c482f-1a78-4a22-80fe-d6c346f2d22f");
}

// should create a provider /POST providers
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = '/providers';

  const { status, body } = await request.post(url)
    .send({
      name: 'Amazon',
      description: 'www.amazon.com',
      code: 'AMZ',
      schema: {
        name: {
          type: 'string',
          required: true,
        }
      }
    });
  assert.deepStrictEqual(status, 201);
  assert.deepStrictEqual(typeof body, 'object');
  assert.deepStrictEqual(body.name, 'Amazon');
  assert.deepStrictEqual(body.description, 'www.amazon.com');
  assert.deepStrictEqual(body.code, 'AMZ');
  assert.deepStrictEqual(body.schema, { name: { type: 'string', required: true } });
}

// should throw error when creating beneficiary with invalid schema /POST beneficiaries
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = '/beneficiaries';

  const data = {
    name: 'John Doe',
    company: COMPANY_ID,
    document: '12345678901',
    plans: [PROVIDER_ID],
  };

  const { status, error } = await request.post(url).send(data);
  assert.deepStrictEqual(status, 400);
  assert.deepStrictEqual(error.text, JSON.stringify({ message: "Validation Error: 'weight' is required" }));
}


// should create a beneficiary /POST beneficiaries
{
  const app = server.createInstanceServer();
  const request = supertest(app);
  const url = '/beneficiaries';

  const data = {
    name: 'John Doe',
    company: COMPANY_ID,
    document: "12345678901",
    weight: 80,
    height: 1.70,
    plans: [PROVIDER_ID]
  };

  const { status, body } = await request.post(url).send(data);
  assert.deepStrictEqual(status, 201);
  assert.deepStrictEqual(typeof body, 'object');
  assert.deepStrictEqual(body.name, 'John Doe');
  assert.deepStrictEqual(body.company, COMPANY_ID);
  assert.deepStrictEqual(body.document, "12345678901");
  assert.deepStrictEqual(body.plans[0].weight, 80);
  assert.deepStrictEqual(body.plans[0].height, 1.70);
  assert.deepStrictEqual(body.plans[0].name, "John Doe");
  assert.deepStrictEqual(body.plans[0].provider, PROVIDER_ID);
}