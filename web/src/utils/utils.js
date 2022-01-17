const renderDot = (props) => {
  const { cx, cy, stroke, key } = props;
  if (cx === +cx && cy === +cy) {
    return <path d={`M${cx - 2},${cy - 2}h4v4h-4Z`} fill={stroke} key={key} />;
  } else return null;
};

const getAxisTime = () => {
  const sec = new Date().getSeconds();
  const ms = new Date().getMilliseconds();
  const time = `${sec}.${Math.floor(ms / 100)}`;
  return time;
};

const countAnglesHandler = (data) => {
  const x = data.accel["x"];
  const y = data.accel["y"];
  const z = data.accel["z"];

  const angle_x = Math.atan2(x, Math.sqrt(y * y + z * z)) / (Math.PI / 180);
  const angle_y = Math.atan2(y, Math.sqrt(x * x + z * z)) / (Math.PI / 180);
  const angle_z = Math.atan2(z, Math.sqrt(x * x + y * y)) / (Math.PI / 180);

  const angle = {
    X: angle_x,
    Y: angle_y,
    Z: angle_z,
  };
  return angle;
};

export { renderDot, getAxisTime, countAnglesHandler };
