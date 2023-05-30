# Password1

An Encrypted, Safe and Secure Password Manager to manage all your passwords in a secure way

Password1 - Is your free, open-source password manager
for secure and effortless password management.
Create a profile today and take control of your
online security with our state-of-the-art encryption
that will ensure that your passwords are always safe
:)

---

## What is this?
Password1 is password manager that I making for a computer science assessment. To be more specific, this application is for the double assessment of AS91896 & AS91897.

## Videos:
Please watch the video in my presentation for a demo and walkthrough of the code and application. In the demo video I go through all the features in the app and show how they work, I also test out providing invalid input and show how my program reacts. In the code walkthrough video I will briefly go over the file structure and originzation of my program. I will also show which file are written by me and which are by the framework either React/Vite or Tauri.

## Folder/Codebase Structure
The codebase for this application is split into main folders:
* `api/`
* `app/`

These are the 2 parts of my app. The API is the server that manages the passwords and connects to the database. The app is used by the client as it is an easy to use GUI compared to the api. The client will handle making requests and all encryption will be done client side. No keys will be stored in the database, not even hashed. The only exception is the authentication key which is stored hashed as it is required for authentication. Never will the master password or any other keys derived from it be transmitted over to the server.
The server is intended to be hosted locally for additional security but it is also possible to host it on a VPS and be used by multiple users.

### Why not bundle the api into the app?

There are 2 main reasons for splitting up the application into 2 parts (the gui and the server).  
First reasons it that I want the program to be scalable and accesseble by multiple users. As said in my brief, Jeffrey's entire family needs to be able to use the program. Having a different server on each device is waste of resources as all you really need is one device in the home to host the API.
The second reasons is so that I can add additional client types like a mobile app or CLI tool. If this were bundled into the app, it would require the user to always have the app open even if all they want to use is the CLI tool.

## Setup/Running for yourself
To setup this application there are 2 steps. The first is setting up the API which is slightly tedious but I will describe the whole process and the second is the app which can be downloaded as an executable binary from the releases tab.
For instructions about how to setup the API please read the `README.md` in the `api/` directory. For extra information about installing the App if you are not sure, read the `README.md` in the `app/` directory.

## Brief

**I chose to make my own brief intead of the Julies Party Hire. Here is my brief/assessment task:**

Jeffery can’t remember his passwords to save his life. Because of this he has developed a bad habit of making weak passwords. Jeffery also can not come up with the funds to pay for dashlane or lastpass. Jeffery needs YOU to make him something to manage his passwords securely. Jeffery however is able to remember exactly one strong password. This password will be the master password - The key to the password vault

The password manager must store the following details for each password:
* Password (Encrypted)
* Website URL
* Name (An optional name for the password, default it the website URL)
* Description (An option field to include a description or notes for the password)

The password manager should also be able to support multiple users as Jeffery’s entire family has a really bad memory and are all extremely bad at making passwords. So he should be able to make multiple users for each family member. Profiles/Users should be stored like this:
* Username
* Master Password (Hashed not encrypted or plain text)

To ensure good data collection there must be some constraints on the passwords:
* All passwords stored (especially the master password) should be at least 12 characters long a combination of uppercase letters, lowercase letters, numbers, and symbols also not just a word that can be found in a dictionary
* Usernames have a limit of 3-32 characters long, Allowed Characters: a-z, A-Z, 0-9, '.' and '_' lastly no _ or . at the beginning or end of the username
* Description will have a limit of 2000 characters
* URL is maxed out at 2048 characters

The password manager will also have the ability to generate strong passwords for Jeffrey. This is needed as jeffery sometimes can not come up with a good password. Each record in the database can be edited and deleted as well.

Jeffery sometimes switches devices so he can also backup his database/password vault to a file which can be used on another device.

There must be a lot of security when saving passwords as they must be stored encrypted in the database. To ensure this each password must be encrypted with a different key derived from the master key and a randomly generated salt. This should make sure no one with the database cannot extract the password as they need the master password to get it. The master password is the only thing that jeffery needs to remember.
