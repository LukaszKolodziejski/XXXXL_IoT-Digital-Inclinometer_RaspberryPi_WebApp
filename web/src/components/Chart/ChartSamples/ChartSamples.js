import React, { useState, useEffect, useCallback, useRef } from "react";

import { useDispatch, useSelector } from "react-redux";

const ChartSamples = (props) => {
  const { X, Y, Z } = useSelector(
    (state) => state.orientation.socketValue.angle
  );
  const [samplesX, setSamplesX] = useState(new Array(20).fill(0));
  const [samplesY, setSamplesY] = useState(new Array(20).fill(0));
  const [samplesZ, setSamplesZ] = useState(new Array(20).fill(0));

  useEffect(() => {
    const samplesHandler = (V, setSamples) => {
      const v = Math.floor(V * 10) / 10;
      setSamples((prevSamples) => {
        const copyPrevSamples = [...prevSamples];
        copyPrevSamples.shift();
        const newSamples = copyPrevSamples.concat(v);
        return newSamples;
      });
    };
    samplesHandler(X, setSamplesX);
    samplesHandler(Y, setSamplesY);
    samplesHandler(Z, setSamplesZ);
  }, [X, Y, Z]);

  useEffect(() => {
    const getDataSamples = (samples) => {
      const angle = [...samples];
      angle.sort((a, b) => a - b);
      const avg =
        Math.floor(((angle[15] + angle[16] + angle[17]) / 3) * 10) / 10;
      return avg;
    };

    const x = getDataSamples(samplesX);
    const y = getDataSamples(samplesY);
    const z = getDataSamples(samplesZ);

    props.onGetDataSamples(x, y, z);
  }, [samplesX, samplesY, samplesZ]);

  return <></>;
};

export default ChartSamples;
