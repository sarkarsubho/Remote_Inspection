import React, { useState, useRef, useEffect } from "react";

const CameraApp = () => {
  const [selectedCamera, setSelectedCamera] = useState("user"); // 'user' for front camera, 'environment' for back camera
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [zoomLevel, setZoomLevel] = useState(1);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const handleCameraToggle = () => {
    setSelectedCamera(selectedCamera === "user" ? "environment" : "user");
  };

  const handleAspectRatioChange = (newAspectRatio) => {
    setAspectRatio(newAspectRatio);
  };

  const handleCaptureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    // Here you can handle the captured image data, such as saving it or displaying it in a gallery
    console.log("Captured image:", imageDataUrl);
  };

  const handleZoomIn = () => {
    // setZoomLevel((prevZoom) => prevZoom + 0.1);
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(0.1, prevZoom - 0.1));
  };

  async function getMedia(v) {
    let stream = null;
    let constraints = {
      video: {
        aspectRatio: { ideal: eval(aspectRatio.replace(":", "/")) },
        zoom: zoomLevel,
      },
    };

    if (selectedCamera === "user") {
      constraints.video.facingMode = { exact: "environment" };
    } else {
      constraints.video.facingMode = { exact: "environment" };
    }

    console.log(constraints);

    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints);
    //  stream = stream.json();
      videoRef.current.srcObject = stream;
      /* use the stream */
    } catch (err) {
      /* handle the error */
      console.error("camera error",err.message);
    }
  }

  //   navigator.mediaDevices
  //     .getUserMedia(constraints)
  //     .then((stream) => {
  //       videoRef.current.srcObject = stream;
  //     })
  //     .catch((error) => {
  //       console.error("Error accessing camera:", error);
  //     });
  console.log(selectedCamera);
  useEffect(()=>{
    getMedia()

  },[selectedCamera])
  return (
    <div className="camera-app">
      <div className="camera-controls">
        <button onClick={handleCameraToggle}>Toggle Camera</button>
        <div>
          <label htmlFor="aspectRatio">Aspect Ratio:</label>
          <select
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => handleAspectRatioChange(e.target.value)}
          >
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
            <option value="1:1">1:1</option>
          </select>
        </div>
        <div>
          <button onClick={handleZoomIn}>Zoom In</button>
          <button onClick={handleZoomOut}>Zoom Out</button>
          <input
            type="range"
            value={zoomLevel}
            min={0}
            max={10}
            onChange={(e) => setZoomLevel(e.target.value)}
            step={0.5}
          />
        </div>
        <button onClick={handleCaptureImage}>Capture Image</button>
      </div>
      <div className="camera-view" style={{ overflow: "hidden" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          style={{ transform: `scale(${1 / zoomLevel})` }}
        />
        <canvas ref={canvasRef} style={{ display: "none" }} />
      </div>
    </div>
  );
};

export default CameraApp;
