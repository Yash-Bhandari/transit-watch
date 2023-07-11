## Custom server with TypeScript + Nodemon 

Server entry point is `src/server.ts` in development and `dist/server.js` in production.

## Usage

Run `yarn` to install dependencies.

`yarn dev` to start the server in development mode.

`yarn build` to build the server for production.

`yarn start` to start the server in production mode.

The dist and .next folders are required to run the server in production mode.

To run as a daemon, install pm2 globally with `yarn global add pm2` and then run

`pm2 start "yarn run start" --name 'transit-watch'`

## License

Made available under the GPL-3.0 License.