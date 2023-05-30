# Password Manager REST API

The Password1 API is meant to be locally hosted, either on the same machine as the user or one machine in the house of the user.  It is used to provide an abtraction over the database to make things easier for the client. It manages storing multiple users and the passwords of all these users. It is to mention that all encryption is done client side so the server never has access to the master password or any  password in a user's account. The API is built with the framework FastAPI as it a fast, reliable rest api framework for python.

## Code/File Structure
```bash
.
├── Makefile # for command aliases
├── README.md # this readme 
├── assets # folder with assets for the API
│   └── markdown
│       └── description.md # swagger docs description
├── src
│   ├── core # where all reusable code goes
│   │   ├── __init__.py
│   │   ├── db # where the db config and db is stored
│   │   │   ├── __init__.py
│   │   │   └── tortoise_conf.py
│   │   ├── helpers
│   │   │   ├── __init__.py
│   │   │   ├── argon_hash.py # functions for hashing and verifying hashes
│   │   │   └── exceptions.py # custom errors thrown by the api
│   │   └── models # classes for the api
│   │       ├── __init__.py
│   │       ├── api.py # fastapi subclass
│   │       ├── passwords.py # database models for a password record
│   │       └── users.py # db models for a user
│   ├── main.py # main startup script
│   ├── requirements.txt # dependencies list
│   └── routes
│       ├── __init__.py
│       ├── other.py # other routes that dont really matter
│       ├── passwords.py # routes related to passwords
│       └── users.py # routes related to users
└── tests # test code I decided to keep for evidence
    ├── __init__.py
    └── username_validation.py

10 directories, 24 files
```

## Running The REST API
**Note you must have python and pip installed to run this.**  
To run the API you need to first download the source code. You can either do that by downloading the repository as a zip file [here](https://github.com/st22209/Password-Manager/archive/refs/heads/main.zip), or you  cloning the repo with:
```bash
git clone https://github.com/st22209/Password-Manager.git
```
Once you obtain the source code, first go into the directory where the API code is stored (`Password-Manager/api`). If you downloaded as a zip the directory might be `Password-Manager-main/api`.  
Once you are in this directory you must first install all the required dependencies with pip. The requirements file is located in `api/src/requirements.txt` so to install them use:
```bash
pip install -r requirements.txt
```
If this was successfull you should be done and can now run the API. If you have make installed, simply type `make run` to run the API in production mode. If you dont have make and are on a UNIX platform such as linux or mac use:
```
DEVMODE=true python3 src/main.py
```` 

Make sure the devmode flag is provided and also for you it might be python instead of python3.

If on windows you'll have to set the enviroment variable first using:
```
set DEVMDODE=false
python3 src/main.py
```
After runnning the command for your system to startup the api you should be able to see a message in console reading "API has started!". If you see this everything has worked and there is no more further setup.

You can now run the App and it should work out of the box connecting to the API.