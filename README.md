# EasyWrite

> Easy Write Application , The best app for writer!

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).


## Package.json Scripts
> This script is for WINDOWS ONLY, will create "migration file" in "api/migrations"
```
"migration-win" : "cross-env NODE_ENV=development knex migrate:make %npm_package_version% --knexfile=./api/knexfile.js",
```
> This script is for MAC & LINUX will, create "migration file" in "api/migrations"
```
"migration-mac-linux" : "cross-env NODE_ENV=development knex migrate:make $npm_package_name --knexfile=./api/knexfile.js"
```
