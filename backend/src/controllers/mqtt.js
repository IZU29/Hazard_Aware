const mqtt = require('mqtt');

const MQTT_BROKER = 'mqtt://broker.hivemq.com:1883';
// Wildcard subscription captures telemetry from all nodes
const MQTT_STREAM_TOPIC = 'futo/security/+/log';
const MQTT_CMD_TOPIC_PREFIX = 'futo/security';

const { saveHazardClip } = require('../services/surveillance');

// Multi-Node System State Storage
let systemStates = {};

// Helper to initialize or retrieve state for a given node
const getNodeState = (nodeId) => {
  if (!systemStates[nodeId]) {
    systemStates[nodeId] = {
      nodeId: nodeId,
      timestamp: "Awaiting hardware sync...",
      temp: "--°C",
      flame: "Safe",
      gas: 0,
      smoke: 0,
      lastCardId: "No Scan",
      unidentifiedCardId: null,
      hazardState: "Normal",
      confidence: 100
    };
  }
  return systemStates[nodeId];
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

    // Extract node ID from payload or infer from topic name
    const topicParts = topic.split('/');
    const nodeFromTopic = topicParts[2] === 'node_2' ? 'NODE_02_ANNEX' : 'NODE_01_GATEWAY';
    const nodeId = payload.node_id || payload.nodeId || nodeFromTopic;

    const currentState = getNodeState(nodeId);
    currentState.timestamp = new Date().toLocaleTimeString();

    if (payload.type === "ENVIRONMENT") {
      currentState.temp = payload.temp;
      currentState.flame = payload.flame;
      currentState.gas = payload.mq6;
      currentState.smoke = payload.mq2;
      currentState.hazardState = payload.hazard;
      currentState.confidence = payload.confidence;
    } else if (payload.type === "ACCESS") {
      currentState.lastCardId = payload.cardId;
    } else if (payload.type === "UNIDENTIFIED_RFID") {
      currentState.unidentifiedCardId = payload.cardId;
    }

    if (currentState.hazardState === 'FIRE' || payload.type === 'UNIDENTIFIED_RFID') {
      saveHazardClip(
        payload.type === 'UNIDENTIFIED_RFID' ? 'UNAUTHORIZED_RFID' : 'ALARM',
        payload.type === 'UNIDENTIFIED_RFID' ? `Unknown Card: ${payload.cardId}` : 'Flame/Gas Alert'
      );
    }

    // Dynamic SSE Broadcast: Stream updated state with node identity to all web clients
    connectedWebClients.forEach(client => {
      client.res.write(`data: ${JSON.stringify(currentState)}\n\n`);
    });

  } catch (err) {
    console.log('Malformed payload skipped:', message.toString());
  }
});

const connectBroker = (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Stream current states of all nodes on fresh connection
  res.write(`data: ${JSON.stringify(Object.values(systemStates))}\n\n`);

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  connectedWebClients.push(newClient);

  req.on('close', () => {
    connectedWebClients = connectedWebClients.filter(c => c.id !== clientId);
  });
};

const managerRfidCard = (req, res) => {
  const { action, cardId, targetNode } = req.body;

  if (!action) {
    return res.status(400).json({ success: false, message: 'Action is required' });
  }

  // Pure state reset: clear unidentified card buffer for specific or all nodes
  if (action === "CLEAR_UNIDENTIFIED") {
    if (targetNode && systemStates[targetNode]) {
      systemStates[targetNode].unidentifiedCardId = null;
    } else {
      Object.keys(systemStates).forEach(id => {
        systemStates[id].unidentifiedCardId = null;
      });
    }
    return res.status(200).json({ success: true, message: 'Unidentified card buffer cleared' });
  }

  if (!cardId) {
    return res.status(400).json({ success: false, message: 'cardId is required for hardware commands' });
  }

  // Determine target topic based on requested targetNode (defaults to gateway)
  const nodeSubTopic = targetNode === 'NODE_02_ANNEX' ? 'node_2' : 'gateway';
  const targetCmdTopic = `${MQTT_CMD_TOPIC_PREFIX}/${nodeSubTopic}/command`;

  const payload = JSON.stringify({ action, cardId });
  
  mqttClient.publish(targetCmdTopic, payload, {}, (err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to dispatch command to ESP32' });
    }

    if (action === "ADD_CARD") {
      if (targetNode && systemStates[targetNode]) {
        systemStates[targetNode].unidentifiedCardId = null;
      } else {
        Object.keys(systemStates).forEach(id => {
          systemStates[id].unidentifiedCardId = null;
        });
      }
    }

    return res.status(200).json({ success: true, message: `Command ${action} sent for card ${cardId} to ${nodeSubTopic}` });
  });
};

module.exports = {
  connectBroker,
  managerRfidCard
};