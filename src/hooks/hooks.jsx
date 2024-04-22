import { useEffect, useState } from "react";

export const useGetCams = () => {
  const [cams, setCams] = useState([]);

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((data) => {
      let deviceIds = data
        .filter((e) => e.kind === "videoinput")
        .map((e) => e.deviceId);

      setCams(deviceIds);
    });
  }, []);

  // console.log(cams);

  return [cams];
};
