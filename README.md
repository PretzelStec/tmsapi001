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
|  | /recover | [POST] Used to send a recovery link to specified email in body. |
|  | /upload/profile-image | [POST] used to upload a user image. key is 'file' |
|  | /request-phone-login | [POST] send a code to phone attached to a user. use this code in \phone-login. code only lasts 5 min then expires. |
|  | /phone-login | [POST] logs the user in an returns a token using the code sent to a phone number. |
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
|  | /[license plate number] | [PATCH] edit details of a truck |
|  | /[license plate number] | [DELETE] delete a truck |
| /trailers | / | [GET] get all trailers |
|  | / | [POST] add a new trailer |
|  | /[license plate number] | [GET] get trailer details by license plate number |
|  | /[license plate number] | [PATCH] edit details of a trailer |
|  | /[license plate number] | [DELETE] delete a trailer |
| /loads | / | [GET] gets all loads associated with your company |
|  | / | [POST] post a new load |
|  | /[load id] | [GET] get a specific load |
|  | /[load id] | [PATCH] edit a load |
|  | /[load id] | [DELETE] delete a load |
|  | /bump/[load id] | [PATCH] bump the status of a load (upcoming -> current -> previous) |
|  | /myloads | [GET] get all of the loads assigned to you as a driver |
|  | /[load id]/upload/[doc name] | [POST] uploads document and saves address to load. use form-data with key "file". |
| /customers | / | [GET] get all customers |
|  | / | [POST] add a new company |
|  | /[company id] | [GET] get company details by id |
|  | /[company id] | [PATCH] edit details of a company |
|  | /[company id] | [DELETE] delete a company |
| /locate | / | [POST] post/update location |
|  | / | [GET] Get all locations associated with your company. |
|  | /[User Id] | [GET] get location of a specific user. |

# JSON Templates
## Register User + Company
```json
{
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
## Load
```json
{
  "customer": "",
  "commodity": "",
  "weight": "",
  "rate": "", 
  "bol": "",
  "bolPath": "",
  "scale": "",
  "scalePath": "",
  "lumper": "",
  "lumberPath": "",
  "inventory": "",
  "inventoryPath": "",
  "other1": "",
  "other1Path": "",
  "other2": "",
  "other2Path": "",
  "locationImage": "",
  "pickup": [
    {
      "date":"",
      "shipper":"",
      "street": "",
      "city":"",
      "state":"",
      "zip":""
    }
  ],
  "drop": [
    {
      "date":"",
      "reciever":"",
      "street": "",
      "city":"",
      "state":"",
      "zip":""
    }
  ],
  "driver":"",
  "notes": "These are the notes for the load"
}
```
## Login
```json
{
  "email":"",
  "password":""
}
```

## Locate
```json
{
  "user":"",
  "companyId":"",
  "latitude":"",
  "longitude":"",
  "accuracy":"",
  "altitudeAccuracy":"",
  "altitude":"",
  "speed":"",
  "heading":""
}
```
