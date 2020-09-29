
### `Intro`
dotenv loads a formated .env file into process.env

#### `Install`
``` bash
npm install --save git+https://git@github.com/anzerr/dotenv.git
npm install --save @anzerr/dotenv
```

### `Example`
.env files
```dosini
APP_PORT=3005
```
``` javascript
require('@anzerr/dotenv').config();
console.log(process.env.APP_PORT); // 3005
```