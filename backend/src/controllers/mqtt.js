const mqtt = require('mqtt');

const MQTT_BROKER = 'mqtt://broker.hivemq.com:1883';
const MQTT_TOPIC = 'futo/security/gateway/log';

let systemState = {
    timestamp: "Awaiting hardware sync...",
    temp: "--°C",
    flame: "Safe",
    gas: 0,
    lastCardId: "No Scan"
};

let connectedWebClients = [];

// Initialize network connection to the cloud MQTT broker
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
    console.log('✔ Backend API Server bridged successfully to Cloud Broker');
    mqttClient.subscribe(MQTT_TOPIC);
});

mqttClient.on('message', (topic, message) => {
    try {
        const payload = JSON.parse(message.toString());
        systemState.timestamp = new Date().toLocaleTimeString();

        if (payload.type === "ENVIRONMENT") {
            systemState.temp = payload.temp;
            systemState.flame = payload.flame;
            systemState.gas = payload.gas;
        } else if (payload.type === "ACCESS") {
            systemState.lastCardId = payload.cardId;
        }

        // Push data to all active web browser instances in real-time
        connectedWebClients.forEach(client => {
            client.res.write(`data: ${JSON.stringify(systemState)}\n\n`);
        });

        console.log('[Pipeline Stream Sync Out]:', systemState);
    } catch (err) {
        console.log('Malformed payload skipped:', message.toString());
    }
});

const connectBroker = (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Flush current state instantly on UI initialization
    res.write(`data: ${JSON.stringify(systemState)}\n\n`);

    const clientId = Date.now();
    const newClient = { id: clientId, res };
    connectedWebClients.push(newClient);

    req.on('close', () => {
        connectedWebClients = connectedWebClients.filter(c => c.id !== clientId);
    })
}

module.exports = {
    connectBroker
}