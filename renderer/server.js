import chokidar from 'chokidar';
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import WebSocket from 'ws';
import { exec } from 'child_process';

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

wss.on('connection', (ws) => {
  sendFile(ws, '../mermaid_files/edit.mmd');
});

const watcher = chokidar.watch('../mermaid_files/edit.mmd', {
  ignoreInitial: false
});

function sendFile(ws, filePath) {
  exec(`mmdc -i ${filePath} --output -`, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout) => {
    if (error) return;
    const message = JSON.stringify({ content: stdout });
    ws.send(message);
  });
}

watcher.on(
  'change', (path) => {
    for (const ws of wss.clients) {
      if (ws.readyState === WebSocket.OPEN) {
        sendFile(ws, path);
      }
    }
  }
);

server.listen(2195, () => {
  console.log('Server and WebSocket running on port 2195');
});
