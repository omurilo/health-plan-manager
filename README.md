# Health Manager
## Purpose
This project is developed to test my abilities to code a project without any external dependency and my knowledge about data structures and too my logical thinking

## About
This project is a business manager aggregating health benefits for companies and their employees

## API:
### Examples:

  * Find companies
```json
// GET /companies
[
  {
    "id": "6a93b22c-d2a2-4c7e-854b-4aee1d38c1a0",
    "name": "Acme Co",
    "providers": [
      "9d6b8e37-47e4-44ab-b604-1d7a96f3ac3e",
      "6cd50011-5525-4e74-ab7a-0b39acb0774d"
    ]
  },
  {
    "id": "dc634c7f-88c7-4228-be68-fed3cae5302c",
    "name": "Tio Patinhas Bank",
    "providers": [
      "6cd50011-5525-4e74-ab7a-0b39acb0774d",
      "102c482f-1a78-4a22-80fe-d6c346f2d22f",
      "222560f1-f7ca-47e0-828b-a430121c7cf8"
    ]
  }
]
```

   * Find beneficiaries
```json
// /GET /beneficiaries
[
  {
    "name": "Maria Silva",
    "company": "6a93b22c-d2a2-4c7e-854b-4aee1d38c1a0",
    "document": "092.221.235-68",
    "plans": [
      {
        "name": "Maria Silva",
        "document": "092.221.235-68",
        "weight": 62,
        "height": 1.6,
        "provider": "6cd50011-5525-4e74-ab7a-0b39acb0774d"
      }
    ],
    "id": "a7384559-8240-4fdd-ac4e-841449059eac"
  }
]
```

* Find providers
  <details>
    <summary>Expand to view response object</summary>

      // GET /providers

      [
        {
          "id": "6cd50011-5525-4e74-ab7a-0b39acb0774d",
          "name": "Dental Sorriso",
          "code": "DS",
          "description": "Plano Odontológico Dental Sorriso",
          "schema": {
            "name": {
              "type": "string",
              "required": true
            },
            "document": {
              "type": "string",
              "required": true
            },
            "weight": {
              "type": "number",
              "required": true
            },
            "height": {
              "type": "number",
              "required": true
            }
          }
        },
        {
          "id": "102c482f-1a78-4a22-80fe-d6c346f2d22f",
          "name": "Mente Sã, Corpo São",
          "code": "MC",
          "description": "Plano saúde mental Mente Sã, Corpo São",
          "schema": {
            "document": {
              "type": "string",
              "required": true
            },
            "timeSpendLastSevenDays": {
              "type": "number",
              "required": true
            }
          }
        },
        {
          "id": "9d6b8e37-47e4-44ab-b604-1d7a96f3ac3e",
          "name": "Norte Europa",
          "code": "NE",
          "description": "Plano Norte Europa",
          "schema": {
            "name": {
              "type": "string",
              "required": true
            },
            "document": {
              "type": "string",
              "required": true
            },
            "admissionDate": {
              "type": "date",
              "required": true
            },
            "email": {
              "type": "string",
              "required": true
            }
          }
        },
        {
          "id": "222560f1-f7ca-47e0-828b-a430121c7cf8",
          "name": "Pampulha Intermédica",
          "code": "PI",
          "description": "Plano de saúde Pampulha Intermédica",
          "schema": {
            "name": {
              "type": "string",
              "required": true
            },
            "document": {
              "type": "string",
              "required": true
            },
            "admissionDate": {
              "type": "date",
              "required": true
            },
            "address": {
              "type": "string",
              "required": true
            }
          }
        }
      ]
  </details>
&nbsp;
 * Create a new beneficiary request
```json
// POST /beneficiaries request
{
  "plans": [
    "6cd50011-5525-4e74-ab7a-0b39acb0774d",
    "102c482f-1a78-4a22-80fe-d6c346f2d22f",
    "222560f1-f7ca-47e0-828b-a430121c7cf8"
  ],
  "document": "092.221.235-68",
  "timeSpendLastSevenDays": 5.3,
  "name": "Maria Silva",
  "admissionDate": "12/01/2020",
  "email": "mariasilva@empr.br",
  "address": "Av. Paulista, 1552, São Paulo - SP",
  "weight": 62.0,
  "height": 1.60,
  "company": "6a93b22c-d2a2-4c7e-854b-4aee1d38c1a0"
}
```

```json
// /POST /beneficiaries response
{
  "id": "ec9c9815-3767-46d9-903c-b4b06f7da2d3",
  "name": "Maria Silva",
  "company": "6a93b22c-d2a2-4c7e-854b-4aee1d38c1a0",
  "document": "092.221.235-68",
  "plans": [
    {
      "name": "Maria Silva",
      "document": "092.221.235-68",
      "weight": 62,
      "height": 1.6,
      "provider": "6cd50011-5525-4e74-ab7a-0b39acb0774d"
    }
  ]
}
```
PS: Only one plan was assigned to the beneficiary because this company has only one of the plans passed on the request registered as a benefit available to its employees.