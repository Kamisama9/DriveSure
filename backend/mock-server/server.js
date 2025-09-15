const jsonServer = require('json-server');
const path = require('path');

const servers = [
    {
        name: 'riders',
        port: 3005,
        file: 'riderlist.json'
    },
    {
        name: 'drivers',
        port: 3006,
        file: 'driverslist.json'
    },
    {
        name: 'vehicles',
        port: 3007,
        file: 'vehiclelist.json'
    },
    {
        name: 'fares',
        port: 3008,
        file: 'farelist.json'
    },
    {
        name: 'bookings',
        port: 4000,
        file: 'booking.json'
    },
    {
        name: 'transactions',
        port: 4001,
        file: 'transaction.json'
    },
    {
        name: 'verifications',
        port: 4002,
        file: 'verification.json'
    }
];

// Base directory for data files
const BASE_DIR = path.join(__dirname, '../../client/src/data');

// Create and start servers
servers.forEach(({ name, port, file }) => {
    const server = jsonServer.create();
    const router = jsonServer.router(path.join(BASE_DIR, file));
    const middlewares = jsonServer.defaults();

    server.use(middlewares);
    server.use(router);

    server.listen(port, () => {
        console.log(`${name} server is running on port ${port}`);
    });
});
