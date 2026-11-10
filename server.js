const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static('public'));

let estadoGlobal = null;

io.on('connection', (socket) => {
  console.log(`[+] Jogador conectado: ${socket.id}`);

  // Se já houver um jogo rolando, envia o estado para quem entrou agora
  if (estadoGlobal) {
    socket.emit('carregar-mesa', estadoGlobal);
  }

  // Recebe a ação de um jogador e espalha para os outros instantaneamente
  socket.on('acao-mesa', (dados) => {
    estadoGlobal = dados;
    socket.broadcast.emit('atualizar-mesa', dados);
  });

  socket.on('disconnect', () => {
    console.log(`[-] Jogador desconectado`);
  });
});

// Porta automática fornecida pela nuvem ou porta 3000 local
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🎲 Servidor rodando na porta ${PORT}`);
});
