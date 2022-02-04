const y = (x) => {
  // Declaring the function
  // f(x) = 1/(1+x*x)
  return 1 / (1 + x * x);
};

const cumtrapz = (a, b, n = 1) => {
  let h = (b - a) / n;
  let s = y(a) + y(b);

  for (let i = 1; i < n; i++) s += 2 * y(a + i * h);

  return (h / 2) * s;
};

let angleX = 0;
let angleY = 0;
let angleZ = 0;
let prevGyroAngleX = 0;
let prevGyroAngleY = 0;
let prevGyroAngleZ = 0;

const countAnglesHandler = (data) => {
  const x = data.accel["x"];
  const y = data.accel["y"];
  const z = data.accel["z"];
  const gx = data.gyro["x"];
  const gy = data.gyro["y"];
  const gz = data.gyro["z"];

  const accAngleX = Math.atan2(x, Math.sqrt(y * y + z * z));
  const accAngleY = Math.atan2(y, Math.sqrt(x * x + z * z));
  const accAngleZ = Math.atan2(z, Math.sqrt(x * x + y * y));

  const f = 200; // Hz
  const dt = 0.005;
  const T = 1 / (2 * Math.PI * f);
  const K = T / (T + dt);

  const gyroAngleX = cumtrapz(dt, gx);
  const gyroAngleY = cumtrapz(dt, gy);
  const gyroAngleZ = cumtrapz(dt, gz);

  if (angleX === 0) {
    angleX = K * (gyroAngleX * dt) + (1 - K) * accAngleX;
    angleY = K * (gyroAngleY * dt) + (1 - K) * accAngleY;
    angleZ = K * (gyroAngleZ * dt) + (1 - K) * accAngleZ;
  } else {
    angleX = K * (angleX + gyroAngleX - prevGyroAngleX) + (1 - K) * accAngleX;
    angleY = K * (angleX + gyroAngleY - prevGyroAngleY) + (1 - K) * accAngleY;
    angleZ = K * (angleX + gyroAngleZ - prevGyroAngleZ) + (1 - K) * accAngleZ;
  }
  prevGyroAngleX = gyroAngleX;
  prevGyroAngleY = gyroAngleY;
  prevGyroAngleZ = gyroAngleZ;

  return {
    X: angleX,
    Y: angleY,
    Z: angleZ,
  };
};

export { countAnglesHandler };
