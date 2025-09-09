const { spawn } = require('child_process');
const path = require('path');

const servers = [
  { file: '../../client/src/data/riderlist.json', port: 3005 },
  { file: '../../client/src/data/driverslist.json', port: 3006 },
  { file: '../../client/src/data/farelist.json', port: 3008 },
  { file: '../../client/src/data/vehiclelist.json', port: 3007 }
];

servers.forEach(({ file, port }) => {
  const absPath = path.resolve(__dirname, file);
  const proc = spawn('npx', [
    'json-server',
    '--watch',
    absPath,
    '--port',
    port
  ], { stdio: 'inherit', shell: true });

  proc.on('close', code => {
    console.log(`json-server for ${file} exited with code ${code}`);
  });
});