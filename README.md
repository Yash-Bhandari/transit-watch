## Custom server with TypeScript + Nodemon 

Server entry point is `src/server.ts` in development and `dist/server.js` in production.

## Usage

Run `yarn` to install dependencies. Ensure all required environment variables are set or added to a file entitled .env.local at the project root.

`yarn dev` to start the server in development mode.

`yarn build` to build the server for production.

`yarn start` to start the server in production mode.

The dist and .next folders are required to run the server in production mode.

To run as a daemon, install pm2 globally with `yarn global add pm2` and then run

`pm2 start "yarn run start" --name 'transit-watch'`

## Config

The following environment variables must be set:

DESTINATION_PHONE_NUMBER: phone number that is sent summaries of reports and links to live chat.

## License

Made available under the GPL-3.0 License.
