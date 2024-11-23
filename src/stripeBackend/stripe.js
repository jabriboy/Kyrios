import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

const app = express();

// Configuração de SSE (Server-Sent Events)
let clients = [];

// Função para enviar eventos ao frontend via SSE
const sendEventToClients = (eventData) => {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  });
};

// Rota para receber conexões SSE do frontend
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push({ res });

  // Enviar uma mensagem inicial para o cliente
  res.write('data: {"message": "Conexão estabelecida"}\n\n');

  // Remover o cliente quando a conexão for fechada
  req.on('close', () => {
    clients = clients.filter(client => client.res !== res);
  });
});

// Webhook da Stripe para receber eventos
app.post('/webhook', express.raw({ type: 'application/json' }), (request, response) => {
  let event = request.body;

  if (endpointSecret) {
    const signature = request.headers['stripe-signature'];

    try {
      event = stripe.webhooks.constructEvent(request.body, signature, endpointSecret);
    } catch (err) {
      console.error(`⚠️  Webhook assinatura falhou: ${err.message}`);
      return response.status(400).send(`Webhook Error: ${err.message}`);
    }
  }

  // Processar o evento e enviar para o frontend via SSE
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      sendEventToClients({
        eventType: event.type,
        eventData: paymentIntent
      });
      break;

    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      sendEventToClients({
        eventType: event.type,
        eventData: paymentMethod
      });
      break;

    case 'customer.subscription.deleted':
      const subscription = event.data.object;
      sendEventToClients({
        eventType: event.type,
        eventData: subscription
      });
      break;

    case 'invoice.payment_succeeded':
      const invoice = event.data.object;
      sendEventToClients({
        eventType: event.type,
        eventData: invoice
      });
      break;

    default:
      console.log(`Evento não tratado: ${event.type}`);
      break;
  }

  // Retornar resposta 200 para confirmar recebimento
  response.status(200).send('Evento recebido');
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
