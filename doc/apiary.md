FORMAT: 1A

# Budget.MAX_VALUE
Budget API is a service to handle all monetary transactions

# Group Labels
Labels related resources of the **Budget API**

## Labels Collection [/labels]
+ Model (application/json)
    + Body
            
            [{
              "id": 1, "name": "Food"
            }, {
              "id": 2, "name": "Drink"
            }]

### List all Labels [GET]
+ Response 200

    [Labels Collection][]

### Create a Label [POST]
+ Request (application/json)

        { "name": "Clothes" }

+ Response 201

    [Label][]

## Label [/labels/{id}]
A single Label object with all its details

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Label to perform action with. Has example value.

+ Model (application/json)
    + Body
    
            { "id": 2, "title": "Drink" }

### Retrieve a Label [GET]
+ Response 200 (application/json)

    + Body

            { "id": 2, "title": "Drink" }

### Update a Label [PUT]
+ Request (application/json)

        { "name": "Clothes" }

+ Response 200

    [Label][]

### Remove a Label [DELETE]
+ Response 204

# Group Transactions

## Transactions Collection [/transactions]
+ Model (application/json)
    + Body
        
            [{
                "id": 1,
                "date": 1426887490612,
                "amount": 10.12,
                "description": "Coca cola",
                "method": "bank",
                "location": "Kwik-E-Mart",
                "lineItems": []
            }]

### List all Transactions [GET]
+ Response 200
    [Transaction][]

### Create a Transaction [POST]
+ Request (application/json)

        {
            "date": 1426887490612,
            "amount": 10.12,
            "description": "Coca cola",
            "method": "bank",
            "location": "Kwik-E-Mart",
            "lineItems": []
        }

+ Response 201
    [Transaction][]

## Transaction [/transactions/{id}]
A single Transaction object with all its details

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the Transaction to perform action with. Has example value.

+ Model (application/json)
    + Body
        
            {
                "id": 1,
                "date": 1426887490612,
                "amount": 10.12,
                "description": "Coca cola",
                "method": "bank",
                "location": "Kwik-E-Mart",
                "lineItems": []
            }
    
### Retrieve a Transaction [GET]
+ Response 200
    [Transaction][]

### Update a Transaction [PUT]
+ Request (application/json)

        {
            "date": 1426887490612,
            "amount": 10.12,
            "description": "Lunch",
            "method": "bank",
            "location": "Kwik-E-Mart",
            "lineItems": [{
                "id": 1,
                "name": "Coca cola",
                "amount": 10.12,
                "labelIds": [1, 2]
            }]
        }

+ Response 200
    [Transaction][]

### Remove a Transaction [DELETE]
+ Response 204

# Group Line Items
## Transaction LineItem [/transactions/{transactionId}/lineItems]
A LineItem object in the context of transaction

+ Parameters
    + transactionId (required, number, `1`) ... Numeric `id` of the Transaction to perform lineItem action with. Has example value.

### Add a line item [POST]
+ Request (application/json)
    
        {
            "name": "Coca cola",
            "amount": 12.10
        }

+ Response 201
    [LineItem][]

## LineItem Collection [/lineItems{?name,label}]
+ Parameters
    + name (optional, string, `Coca cola`) ... Name of line items to retrieve.
    + label (optional, number, `1`) ... Id of Label which transactions to retrieve.

+ Model (application/json)
    + Body
    
            [{
                "id": 1,
                "name": "Coca cola",
                "amount": 12.10
            }]

### Retrieve LineItems [GET]
+ Response 200
    [LineItem Collection][]

## LineItem [/lineItems/{id}]
A LineItem object in the context of transaction

+ Parameters
    + id (required, number, `1`) ... Numeric `id` of the LineItem to perform action with. Has example value.
    
+ Model (application/json)
    + Body
    
            {
                "id": 1,
                "name": "Coca cola",
                "amount": 12.10
            }

### Update LineItem [PUT]
+ Request (application/json)
    
        {
            "name": "Coca cola",
            "amount": 12.10
        }

+ Response 200
    [LineItem][]

### Remove LineItem [DELETE]
+ Response 204


# Group auth
## Authentication [/auth]
### Authenticate
+ Request (application/json)
    
        {
            "username": "user",
            "password": "password
        }

+ Response 200
+ Response 403


