### TMS API
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
|  | /[license plate number] | [PATCH] not implemented yet |
| /trailers | Text |
| /loads | Title |
| /customer | Text |
