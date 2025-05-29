import chokidar from 'chokidar';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const watcher = chokidar.watch('../mermaid_files', { 
  ignored: (path, stats) => stats?.isFile() && !path.endsWith('.mmd'),
});

watcher.on('change', (path )=> {});

server.listen(8080, () => {
  console.log('Server and WebSocket running on port 8080');
});
