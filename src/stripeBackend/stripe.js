require('dotenv').config();

const fs = require('fs');
const https = require('https');
const express = require('express');
const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_KEY;

const app = express();

// Carregar certificados SSL
const sslOptions = {
  key: fs.readFileSync('/etc/letsencrypt/live/sejakyrios.com.br/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/sejakyrios.com.br/fullchain.pem'),
};

// Configuração de SSE (Server-Sent Events)
let clients = [];

const sendEventToClients = (eventData) => {
  clients.forEach(client => {
    client.res.write(`data: ${JSON.stringify(eventData)}\n\n`);
  });
};

app.get('/stripeBackend/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  clients.push({ res });

  res.write('data: {"message": "Conexão estabelecida"}\n\n');

  req.on('close', () => {
    clients = clients.filter(client => client.res !== res);
  });
});

// Webhook da Stripe
app.post('/stripeBackend/webhook', express.raw({ type: 'application/json' }), (request, response) => {
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

  switch (event.type) {
    case 'payment_intent.succeeded':
    case 'payment_method.attached':
    case 'customer.subscription.deleted':
    case 'invoice.payment_succeeded':
    case 'customer.subscription.updated':
      sendEventToClients({
        eventType: event.type,
        eventData: event.data.object
      });
      break;

    default:
      console.log(`Evento não tratado: ${event.type}`);
      break;
  }

  response.status(200).send('Evento recebido');
});

// Iniciar servidor HTTPS
const PORT = process.env.PORT || 3000;

https.createServer(sslOptions, app).listen(PORT, () => {
  console.log(`Servidor HTTPS rodando na porta ${PORT}`);
});
