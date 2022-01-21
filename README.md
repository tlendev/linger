# Linger

![logo](./logo.png)

## The spiritual successor to lingus

---

## Stack used

-   [https://www.typescriptlang.org/](Typescript)
-   [https://swc.rs/](SWC)
-   [https://yarnpkg.com/](Yarn)
-   [https://nodejs.org/en/](Nodejs)
-   [https://pptr.dev/](Puppeteer)
-   [https://www.npmjs.com/package/dotenv](Dotenv)
-   [https://www.npmjs.com/package/uuid](UUID)
-   [https://www.npmjs.com/package/nodemon](Nodemon)

---

## Instalation

### Prerequisites:

-   Nodejs: ^16.13.2
-   Git ^2.33.0
-   Terminal emulator

### Cloning the repository

`git clone https://github.com/tlendev/linger.git`
`cd linger`

### Installing dependencies

`npm install` or `yarn`

### Creating a _.env_ file

`touch .env` or just create the file using your preferred desktop environment

### Setting the cookie

Open the _.env_ file and add a field with your lingos autologin cookie. You should name the secret _AUTO_LOGIN_COOKIE_
The content of the file should look like this:

```text
AUTO_LOGIN_COOKIE=YOURCOOKIEVALUE
```

---

## Launching the bot

`npm run start` or `yarn start`

---

## Available scripts

-   `start` - start the bot
-   `start:dev` - start the bot in development mode
-   `watch` - start the typescript compiler (requires SWC installed)
