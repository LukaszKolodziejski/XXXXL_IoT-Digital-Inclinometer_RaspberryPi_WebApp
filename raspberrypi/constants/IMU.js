import { Imu as imu } from "node-sense-hat";

const IMU1 = new imu.IMU();
const IMU2 = new imu.IMU();
const IMU3 = new imu.IMU();
const IMU4 = new imu.IMU();

const IMU = [IMU1, IMU2, IMU3, IMU4];

export { IMU };
