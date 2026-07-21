const Component = () => {
    let Gas_sensor = (Math.floor(Math.random() * 2000) > 1000 )? (Math.floor(Math.random() * 2000)) :(1000 + Math.floor(Math.random() * 2000));
    let Temperature_Sensor = (Math.floor(Math.random() * 200) > 100 )? (Math.floor(Math.random() * 200)) :(100 + Math.floor(Math.random() * 200));
    let Flame_Sensor =  false;
    let Vibration_sensor =  false;

    const Component_Payload = {
        "deviceId": 'ESP32_SEC_01',
  "sensors": {
    "vibration": Vibration_sensor, 
    "gas_level": Gas_sensor,
    "temperature_level" : Temperature_Sensor,
    "rfid_tag": "A1B2C3D4",
    "forced_entry_detected": Vibration_sensor,
    "flame_detected" : Flame_Sensor
  }
    }
    console.log(Component_Payload)
    return Component_Payload
}

module.exports = { Component }

// setInterval(Component , 1000)