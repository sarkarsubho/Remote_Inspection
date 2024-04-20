export const useGetCams = async () => {
  let cams = await navigator.mediaDevices.enumerateDevices().then((data) => {
    let deviceIds = data
      .filter((e) => e.kind === "videoinput")
      .map((e) => e.deviceId);
    return deviceIds;
  });

  return [cams];
};
