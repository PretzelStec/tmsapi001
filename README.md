# TMS API
## Description
This API was built to be used to manage data such as loads with multiple pickups and drop offs, for trucking companies.
## Routes
| Route | Sub-Route | Description |
| ----------- | ----------- | ----------- |
| /user | /register | [POST] Used to register new users and companies. |
|  | /login | [POST] Used to login a user. returns token. |
|  | / | [GET] used to get the info of currently logged in user. |
|  | /[user id] | [GET] get the info of a user given their ID. |
|  | /edit/truck | [PATCH] used to edit the truck given a truck id in the request body. |
|  | /edit/password | [PATCH] used to edit the password given new password and current password in the request body. |
| /company | / | [GET] |
|  | /admins | [GET] |
|  | /drivers | [GET] |
|  | /dispatchers | [GET] |
|  | /accountants | [GET] |
|  | /register | [POST] |
|  | /user/[user id] | [DELETE] |
| /trucks | / | [GET] get all trucks |
|  | / | [POST] add a new truck |
|  | /[license plate number] | [GET] get truck details by license plate number |
|  | /[truck id] | [PATCH] edit details of a truck |
| /trailers | / | [GET] get all trailers |
|  | / | [POST] add a new trailer |
|  | /[license plate number] | [GET] get trailer details by license plate number |
|  | /[truck id] | [PATCH] edit details of a trailer |
| /loads | / | [GET] gets all loads associated with your company |
|  | / | [POST] post a new load |
|  | /[load id] | [GET] get a specific load |
|  | /[load id] | [PATCH] edit a load |
|  | /[load id] | [DELETE] delete a load |
|  | /bump/[load id] | [PATCH] pump the status of a load (upcoming -> current -> previous) |
|  | /myloads | [GET] get all of the loads assigned to you as a driver |
| /customer | / | [GET] get all customers |
|  | / | [POST] add a new company |
|  | /[company id] | [GET] get company details by id |
|  | /[company id] | [PATCH] edit details of a company |
|  | /[company id] | [DELETE] delete a company |

# Templates
## Register User + Company
```json
Users : {
  "user": {
      "fname":"user",
      "lname":"user",
      "phone":"11111111111",
      "email":"user@user.com",
      "password":"user",
      "city":"city",
      "state":"state",
      "zip":"100"
  },
  "company": {
      "MC":"1234567",
      "name":"company",
      "state":"state",
      "city":"city",
      "street":"street",
      "street2":"",
      "zipCode":60606,
      "officePhone":"111111111111" 
  }
}
```
## Register User for Company
```json
{
  "fname":"",
  "lname":"",
  "phone":"",
  "email":"",
  "password":"",
  "city":"",
  "state":"",
  "zip":""
}
```
## Truck and Trailer
### For trailer, remove fueltype, fuelcard, ipass, and mileage.
```json
{
  "Unit":"",
  "Type":"",
  "Plate":"",
  "EndDate":"",
  "Status":"",
  "Division":"",
  "State":"",
  "Model":"",
  "Year":"",
  "Color":"",
  "Mileage":"",
  "Make":"",
  "Fueltype":"",
  "Fuelcard":"",
  "Ipass":"",
  "Vin":"",
  "Fname":"",
  "Lname":"",
  "OwnerCity":"",
  "OwnerState":"",
  "OwnerZip": ""
}
```
