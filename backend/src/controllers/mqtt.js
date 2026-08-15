const mqtt = require('mqtt');

const MQTT_BROKER = 'mqtt://broker.hivemq.com:1883';
const MQTT_STREAM_TOPIC = 'futo/security/gateway/log';
const MQTT_CMD_TOPIC = 'futo/security/gateway/command';

let systemState = {
  timestamp: "Awaiting hardware sync...",
  temp: "--°C",
  flame: "Safe",
  gas: 0,
  lastCardId: "No Scan",
  unidentifiedCardId: null,
  hazardState: "Normal",
  confidence: 100
};

let connectedWebClients = [];

const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log('✔ Backend API Server bridged successfully to Cloud Broker');
  mqttClient.subscribe(MQTT_STREAM_TOPIC);
});

mqttClient.on('message', (topic, message) => {
  try {
    const payload = JSON.parse(message.toString());
    systemState.timestamp = new Date().toLocaleTimeString();

    if (payload.type === "ENVIRONMENT") {
      systemState.temp = payload.temp;
      systemState.flame = payload.flame;
      systemState.gas = payload.gas;
      systemState.hazardState = payload.hazard;
      systemState.confidence = payload.confidence;
    } else if (payload.type === "ACCESS") {
      systemState.lastCardId = payload.cardId;
    } else if (payload.type === "UNIDENTIFIED_RFID") {
      systemState.unidentifiedCardId = payload.cardId;
    }

    // Push data to all active web clients in real-time
    connectedWebClients.forEach(client => {
      client.res.write(`data: ${JSON.stringify(systemState)}\n\n`);
    });

  } catch (err) {
    console.log('Malformed payload skipped:', message.toString());
  }
});

const connectBroker = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  res.write(`data: ${JSON.stringify(systemState)}\n\n`);

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  connectedWebClients.push(newClient);

  req.on('close', () => {
    connectedWebClients = connectedWebClients.filter(c => c.id !== clientId);
  });
};

const manageRfidCard = (req, res) => {
  const { action, cardId } = req.body;

  if (!action || !cardId) {
    return res.status(400).json({ success: false, message: 'Action and cardId are required' });
  }

  const payload = JSON.stringify({ action, cardId });
  mqttClient.publish(MQTT_CMD_TOPIC, payload, {}, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to dispatch command to ESP32' });
    }
    
    if (action === "ADD_CARD" && systemState.unidentifiedCardId === cardId) {
      systemState.unidentifiedCardId = null;
    }

    return res.status(200).json({ success: true, message: `Command ${action} sent for card ${cardId}` });
  });
};

module.exports = {
  connectBroker,
  manageRfidCard
};