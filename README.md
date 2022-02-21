# Creating a Digital Inclinometer for the (IoT) Internet of Things:
- Using the sensors from a single board microcomputer with a reading time of a few milliseconds.
- Development of a real-time raw data sharing system via: TCP, UDP, WebSocket, REST interface (HTTP protocol), MQTT.
- Compare and optimize data transfer times in real time in different technologies..
- Development of a real-time data reception and processing interface for the customer. Compare processing time and introduced delays.
- Development of a web application for real-time data visualization.
- ⭐⭐Non-Touch control by Hands Gesture Detection (Hand -> open, closed, 1 finger & Left hand, Right hand & Different combinations hands )
- GPIO Programming to control matrix LED 8x8 (At the same time, the angle of inclination and a spirit level in 2 axes)
 
 
> ## 1. Overview
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/01-overview.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)



```js                  
[ Front-end ]: 
              JavaScript, React, scss, GSAP, Redux, Redux-Thunk, etc..
[ Back-end ]: 
              NodeJS, Express.js, Tensorflow, WebSocket, MQTT
[ Embedded ]: 
              Raspberry Pi, IMU: LSM9DS1 (gyro, accel), TCP, UDP, GPIO
```


---
---
---

> ## 1.1 IoT project diagram:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/02-IoT-project-diagram.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 1.2 An inclinometer is a device that measures the angles of inclination. 
> In this work, it was used:
- Raspberry Pi 3 model B + Single board microcomputer
- Sense Hat - Shield for Raspberry Pi, containing a 3-axis gyroscope, accelerometer, LED matrix, etc.
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/03-raspberrypi-sensehat.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 2. Support for the LSM9DS1 sensor: 
> ### from a single board computer with a reading time of no more than a few milliseconds.
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/04-GIF-moving-the-axis.gif)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 2.1 Marked pixel fields:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/05-1-marked-pixel-fields.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 2.2 Marked pixel fields 2:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/05-2-marked-pixel-fields.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 2.3 Sensor data reading test results:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/06-sensor-handling-results-ms.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 3. Development of a real-time raw data sharing system:
> ### 3.1 Data format for sending:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/07-data-format-for-sending.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 3.2 Way of testing:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/08-way-of-testing.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 3.3 Sending TCP & UDP
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/09-sending-tcp-udp.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 3.4 Sending Websocket & HTTP
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/10-sending-ws-http.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 3.5 Sending MQTT
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/11-sending-mqtt.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 4. Comparison of data transfer times in different technologies. Optimization of data transfer time in real time.
> ### 4.1 Measurement of communication bandwidth Websocket & HTTP:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/12-sending-capacity-ws-http.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 4.2 Measurement of communication bandwidth TCP & UDP:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/13-sending-capacity-tcp-udp.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 4.3 Measurement of communication bandwidth MQTT
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/14-sending-capacity-mqtt.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 4.4 Time difference:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/15-time-difference.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 4.5 app times comparison:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/16-app-times-comparison.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---

> ## 5. Development of a real-time data reception and processing interface.
> ### 5.1 Complementary filter:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/17-receiving-filter.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ###  5.2 Determination of inclinometer value and orientation from raw data and comparison of processing time and introduced delays.
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/18-GIF-raspberrypi-web-app.gif)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 5.3 Websocket - Receiving interface and real-time designated values
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/19-data-reception-ws.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 5.4 Data flow
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/20-data-flow.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 5.5 TCP, UDP - Receiving interface and real-time designated values
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/21-data-reception-tcp-udp.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 5.6 HTTP, MQTT - Receiving interface and real-time designated values
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/22-data-reception-http-mqtt.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 5.7 Inclinometer test results:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/23-protractor-test-results.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 5.8 Inclinometer test results:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/24-GIF-walk-in-room.gif)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 6. Development of a web interface for data visualization in real time:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/25-web-app-diagram.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 6.1 Description of the elements:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/26-description-of-the-elements.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 6.2 Options and slider:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/27-options-and-slider.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 6.3 Graph of visualized samples:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/28-graph-of-visualized-samples.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 6.4 All the results:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/29-all-the-results.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 6.5 All the results without description:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/30-all-the-results-without-description.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ### 6.6 All the results transfer:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/31-all-the-results-transfer.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/32-part-2.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)


[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/33-description-of-hand-gestures.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 7.1 Non-Touch control by Hands Gesture Detection:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/34-GIF-gestures.gif)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## 7.2 Non-Touch control by Hands Gesture Detection:
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/35-GIF-gestures-2-hands.gif)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


> ## Summary
[![Demo CountPages alpha](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp/blob/main/web/src/assets/36-overview.jpg?raw=true)](https://github.com/LukaszKolodziejski/XXXXL_IoT-Digital-Inclinometer_RaspberryPi_WebApp)

---
---
---


