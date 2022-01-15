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

export { renderDot, getAxisTime };
