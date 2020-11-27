
# when run.. this program will create a new company and admin user
# then it will add users within the company and then proceed to
# test permission and data acquisition and give the results

import requests, json, sys, time

def col(str):
    if str == 'failed':
        return ('\033[91m'+'failed'+'\033[0m')
    else:
        return ('\033[92m'+'passed'+'\033[0m')

def userPermTest(token, role):
    print('\033[4m'+'beginning of permission & data acquisition test with ' +role+ '\033[0m')

    headers = {
        'authorization':'Bearer '+token
    }

    if role == 'driver':
        print("loads for this driver : ", len(requests.get(url=url+'/loads/myloads', headers=headers).json()['loads']))

    r = requests.get(url=url+'/user/', headers=headers)
    print('email : \t\t'+r.json()['user']['email'])

    #get and edit loads
    loads = requests.get(url=url+'/loads/', headers=headers).json()['loads']
    loadIndex = random.randrange(0, len(loads)-1)

    print('selected load cust :\t' + loads[loadIndex]['customer'])
    print('selected load pickups :\t' + str(len(loads[loadIndex]['pickup'])))
    print('selected load drops :\t' + str(len(loads[loadIndex]['drop'])))
    print('selected load status :\t' + loads[loadIndex]['status'])

    #updateing load status
    for i in range(4):
        r = requests.patch(url=url+'/loads/bump/' + loads[loadIndex]['_id'], headers=headers)
        print("bumb load status :\t" + col(r.json()['status']))

    loads = requests.get(url=url+'/loads/', headers=headers).json()['loads']
    print('updated load status :\t' + loads[loadIndex]['status'])


    dispatchdata = requests.get(url=url+'/user/' + loads[loadIndex]['dispatch']).json()['user']
    print('dispatch of load :\t' + dispatchdata['email'])

    driverdata = requests.get(url=url+'/user/' + loads[loadIndex]['driver']).json()['user']
    print('driver of load :\t' + driverdata['email'])

    r = requests.patch(url=url+'/loads/' + loads[loadIndex]['_id'], json={
        "status":"previous"
    }, headers=headers)
    print('update load status :\t',col(r.json()['status']))

    #delete a load
    r = requests.delete(url=url+'/loads/' + loads[loadIndex]['_id'], headers=headers)
    print('delete load status :\t',col(r.json()['status']))

    #add user
    #try to add user
    submission = {
        "fname":"test"+modifier,
        "lname":"test"+modifier,
        "phone":"11111111111",
        "email":"test" + modifier +"@user.com",
        "password":"test",
        "city":"city" + modifier,
        "state":"state"+ modifier,
        "zip":"100"+ modifier,
        "role":"company_drivers"
    }

    r = requests.post(url=url+'/company/register', json=submission, headers=headers)

    print('register user status :\t', col(r.json()['status']))

    print()
    


url = "http://localhost:3000"

#used to differentiate users
arg = str(sys.argv[1])
print('\n///////////////////////////////////////')
print('generating new user and company data...')
print('///////////////////////////////////////\n')
time.sleep(3)
modifier = str(sys.argv[1])

#first register and login
loginRoute = '/user/login'
registerRoute = '/user/register'

token = None

submission = {
    "user": {
        "fname":"user"+modifier,
        "lname":"user"+modifier,
        "phone":"11111111111",
        "email":"user" + modifier + "@user.com",
        "password":"user",
        "city":"city" + modifier,
        "state":"state"+ modifier,
        "zip":"100"+ modifier
    },
    "company": {
        "MC":str(int(modifier)*1000),
        "name":"company"+ modifier,
        "state":"state"+ modifier,
        "city":"city"+ modifier,
        "street":"street"+ modifier,
        "street2":"",
        "zipCode":modifier,
        "officePhone":"111111111111" 
    }
}

r = requests.post(url=url+registerRoute, json=submission)
print("registration :\t", col(r.json()['status']))

if r.json()['status'] == 'failed':
    exit()

submission = {
    "email":'user'+modifier+'@user.com',
    "password":"user"
}

r = requests.post(url=url+loginRoute, json=submission)
token = r.json()['token']

if token:
    print("token recieved")
else:
    print("error logging in")
    exit()

#login success.. now we add user to our company..

#first lets add a couple company_drivers
headers = {
    'authorization':'Bearer '+token
}
print('adding drivers...')
for i in range(5):
    submission = {
        "fname":"driver"+modifier+'_'+str(i),
        "lname":"driver"+modifier + '_' + str(i),
        "phone":"11111111111",
        "email":"driver" + modifier + '_' + str(i) + "@user.com",
        "password":"driver",
        "city":"city" + modifier + '_' + str(i),
        "state":"state"+ modifier + '_' + str(i),
        "zip":"100"+ modifier + '_' + str(i),
        "role":"company_drivers"
    }

    r = requests.post(url=url+'/company/register', json=submission, headers=headers)

    if(r.json()['status'] == 'failed'):
        print("failed at adding accountants")
        exit()

print('drivers added successfully')
print('adding accountants...')
# lets add some accountants
for i in range(5):
    submission = {
        "fname":"accountants"+modifier+'_'+str(i),
        "lname":"accountants"+modifier + '_' + str(i),
        "phone":"11111111111",
        "email":"accountants" + modifier + '_' + str(i) + "@user.com",
        "password":"accountants",
        "city":"city" + modifier + '_' + str(i),
        "state":"state"+ modifier + '_' + str(i),
        "zip":"100"+ modifier + '_' + str(i),
        "role":"accountants"
    }

    r = requests.post(url=url+'/company/register', json=submission, headers=headers)

    if(r.json()['status'] == 'failed'):
        print("failed at adding accountants")
        exit()
print('accountants added successfully')
print('adding dispatchers...')
# some dispatchers
for i in range(5):
    submission = {
        "fname":"dispatcher"+modifier+'_'+str(i),
        "lname":"dispatcher"+modifier + '_' + str(i),
        "phone":"11111111111",
        "email":"dispatcher" + modifier + '_' + str(i) + "@user.com",
        "password":"dispatcher",
        "city":"city" + modifier + '_' + str(i),
        "state":"state"+ modifier + '_' + str(i),
        "zip":"100"+ modifier + '_' + str(i),
        "role":"dispatchers"
    }

    r = requests.post(url=url+'/company/register', json=submission, headers=headers)

    if(r.json()['status'] == 'failed'):
        print("failed at adding dispatchers")
        exit()
print('dispatchers added successfully')

# lets add a couple hundred loads and assign them to dispatchers


#get drivers
r = requests.get(url=url+'/company/drivers', headers=headers)
dispatchers = r.json()['users']

#login as dispatch
submission = {
    "email":'dispatcher'+modifier+'_1' +'@user.com',
    "password":"dispatcher"
}

r = requests.post(url=url+loginRoute, json=submission)
print('logging in as dispatcher :', col(r.json()['status']))
token = r.json()['token']
headers = {
    'authorization':'Bearer '+token
}

#add trucks
for i in range(5):
    submission = {
        "Unit":"124_"+modifier+'_'+str(i),
        "Plate":"124_"+modifier+'_'+str(i),
        "State":"Illinois",
        "Model":"HINO155",
        "Year":"2020",
        "Color":"white",
        "Mileage":"21931",
        "Make":"HINO",
        "Fueltype":"diseal",
        "Vin":"329173012739102",
        "Fname":"jacob",
        "Lname":"stec",
        "OwnerCity":"chicago",
        "OwnerState":"IL",
        "OwnerZip": "60638"
    }

    r = requests.post(url = url+'/trucks/', headers=headers, json=submission)
    print('Creating Truck : ', col(r.json()['status']))

trucks = requests.get(url=url+'/trucks', headers=headers).json()['trucks']

drivers = requests.get(url=url+"/company/drivers", headers=headers).json()['users']

for x in range(len(drivers)):
    submission = {
        "email": drivers[x]['email'],
        "password":"driver"
    }
    r = requests.post(url=url+'/user/login', json=submission)
    print('loggin into driver : ', col(r.json()['status']))
    token = r.json()['token']

    headers = {
        'authorization':'Bearer '+token
    }

    submission = {
        "truckId":trucks[x]['_id']
    }

    r = requests.patch(url=url+'/user/edit/truck', headers=headers, json=submission)

    print('update driver truck : ', col(r.json()['status']))

submission = {
    "email":'dispatcher'+modifier+'_1' +'@user.com',
    "password":"dispatcher"
}

r = requests.post(url=url+loginRoute, json=submission)
print('logging in as dispatcher :', col(r.json()['status']))
token = r.json()['token']
headers = {
    'authorization':'Bearer '+token
}

import random
for i in range(int(sys.argv[2])):

    pickups = []
    for j in range(random.randrange(1, 5)):
        pickups.append({
            "date":"rn mane"+str(j),
            "shipper":"me"+str(j),
            "street": "1234"+str(j),
            "city":"chiraq"+str(j),
            "state":"Illinois"+str(j),
            "zip":"69832"+str(j)
        })

    dropoffs = []
    for j in range(random.randrange(1, 5)):
        dropoffs.append({
            "date":"rn mane"+str(j),
            "reciever":"me"+str(j),
            "street": "1234"+str(j),
            "city":"chiraq"+str(j),
            "state":"Illinois"+str(j),
            "zip":"69832"+str(j)
        })

    submission = {
        "customer": "load" + modifier + '_' + str(i),
        "commodity": "water",
        "weight": "123",
        "rate": "123", 
        "bol": "s",
        "bolPath": "s",
        "scale": "s",
        "scalePath": "s",
        "lumper": "s",
        "lumberPath": "s",
        "inventory": "s",
        "inventoryPath": "s",
        "other1": "s",
        "other1Path": "s",
        "other2": "s",
        "other2Path": "s",
        "locationImage": "s",
        "pickup":pickups,
        "drop": dropoffs,
        "driver":dispatchers[random.randrange(0, len(dispatchers)-1)]['_id'],
        "notes": "These are the notes for the load"
    }
    r = requests.post(url=url+'/loads/', json=submission, headers=headers)

    print("creating load " + str(i+1) + ' : ', col(r.json()['status']))


print('\n////////////////////////////////////////////')
print('checking data acquisition and permissions...')
print('////////////////////////////////////////////\n')

time.sleep(2)

#now lets login as driver
submission = {
    "email":'driver'+modifier+'_1' +'@user.com',
    "password":"driver"
}

r = requests.post(url=url+loginRoute, json=submission)
print('logging in as driver :\t', col(r.json()['status']))
token = r.json()['token']

userPermTest(token, 'driver')


#log back into admin
submission = {
    "email":"user" + modifier + "@user.com",
    "password":"user"
}
r = requests.post(url=url+loginRoute, json=submission)
print('logging in as admin :\t', col(r.json()['status']))
token = r.json()['token']

userPermTest(token, 'admin')


#login as accountant
submission = {
    "email":"accountants" + modifier + "_1@user.com",
    "password":"accountants"
}
r = requests.post(url=url+loginRoute, json=submission)
print('logging in as acntnt :\t', col(r.json()['status']))
token = r.json()['token']


userPermTest(token, 'acntnt')





