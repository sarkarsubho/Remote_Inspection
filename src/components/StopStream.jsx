import React, { useState, useRef } from "react";

const CameraComponent = () => {
  const [mediaStream, setMediaStream] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const videoRef = useRef(null);

  const startCamera = async ( fm="user") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: fm },
      });
      setMediaStream(stream);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  };

  const stopCamera = () => {
    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
    startCamera({exact:"environment"})
  };

  const captureImage = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const imageUrl = canvas.toDataURL("image/png");
    // Do something with the captured image, like save it or display it
  };

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.1, 3)); // Assuming max zoom level is 3
    videoRef.current.style.transform = `scale(${zoomLevel})`;
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.1, 1)); // Assuming min zoom level is 1
    videoRef.current.style.transform = `scale(${zoomLevel})`;
  };

  return (
    <div>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ overflow: "hidden", height: "500px", width: "500px" }}
      />
      <div style={{zIndex:10}}>
        <button onClick={startCamera}>Start Camera</button>
        <button onClick={stopCamera}>Stop Camera</button>
        <button onClick={captureImage}>Capture Image</button>
        <button onClick={handleZoomIn}>Zoom In</button>
        <button onClick={handleZoomOut}>Zoom Out</button>
      </div>
    </div>
  );
};

export default CameraComponent;
