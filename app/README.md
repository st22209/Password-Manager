# Password1 Application/Graphical User Interface

The application is made using React/Vite and Tauri. It provides users with an easy to use graphical user interface so they can use the password manager simply, and effectively.

## Running / Setup

To run the application you need to download the excutable binary from the github releases [tab](https://github.com/st22209/Password-Manager/releases). Download the release at the top of the list of releases. 

## Code/File Structure
```bash
.
├── README.md # this readme
├── index.html # the html file where the react code will be injected into
├── package-lock.json
├── package.json # dependencies
├── postcss.config.js
├── src # most of the code written by me is here
│   ├── App.tsx # main file that loads all other pages
│   ├── assets # userful assets
│   │   ├── hero_vault.svg
│   │   ├── index.ts
│   │   └── user_background.svg
│   ├── components # reuasable react components
│   │   ├── edit_pswd_form.tsx # modal that displays for editing a password
│   │   ├── index.ts
│   │   ├── navbar.tsx # navbar that shows on left side of password manager
│   │   ├── pswd_form.tsx # form that shows when creating a new password
│   │   └── pswd_table.tsx # table that is showed on all passwords page
│   ├── core # THE COORRE FOLDER (reusable code/utility code here)
│   │   ├── backup.ts # code to encrypt/decrypt backups
│   │   ├── formCallbacks.ts # functions that run after a form is submited
│   │   ├── index.ts
│   │   ├── kdf.ts # functions used to derive keys, salts etc
│   │   ├── requests.ts # functions ot make requests to the REST API
│   │   ├── types.ts # most of the app's types
│   │   └── validators.ts # functions for validating things like passwords
│   ├── index.css # main css file, tailwind injected into this
│   ├── main.tsx # code that starts react app
│   ├── pages # all the app's different pages
│   │   ├── all_passwords.tsx
│   │   ├── backup.tss
│   │   ├── generate.tsx
│   │   ├── index.ts
│   │   ├── login.tsx
│   │   ├── new_user.tsx
│   │   ├── passwords.tsx
│   │   ├── signup.tsx
│   │   └── wavy.tsx # used for wavy animation (in components folder now)
│   └── vite-env.d.ts
├── src-tauri
│   ├── Cargo.lock
│   ├── Cargo.toml
│   ├── build.rs
│   ├── icons
│   │   ├── 1024.png
│   │   ├── 128.png
│   │   ├── 16.png
│   │   ├── 256.png
│   │   ├── 32.png
│   │   ├── 512.png
│   │   ├── 64.png
│   │   ├── icon.icns
│   │   ├── icon.ico
│   │   └── icon.png
│   ├── src
│   │   └── main.rs # code that loads tauri plugins and starts app
│   └── tauri.conf.json
├── tailwind.config.js
├── tests # test code
│   └── argon_hash.test.js
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

10 directories, 53 files
```

Everything else is mostly config. And if the file isnt listed in the above tree, it doesnt matter and is generated when building.