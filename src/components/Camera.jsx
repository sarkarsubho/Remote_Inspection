import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGetCams } from "../hooks/hooks";

const Camera = () => {
  const [mediaStream, setMediaStream] = useState(null);
  let [camIndex, setCamIndex] = useState(0);
  const [selectedCamera, setSelectedCamera] = useState(""); // environment
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [images, setImages] = useState([]);

  const [getCamErr, setGetCamErr] = useState(false);

  const getCamera = async (fm) => {
    setGetCamErr(false);

    if (mediaStream) {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }

    try {
      let constraints = {
        video: {
          facingMode: fm,
          aspectRatio: { ideal: eval(aspectRatio.replace(":", "/")) },
        },
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setMediaStream(stream);
      videoRef.current.srcObject = stream;
    } catch (error) {
      console.error("Error accessing camera:", error);
      setGetCamErr(true);
    }
  };

  const openFrontCam = () => {
    getCamera("user");
  };

  const openBackCam = () => {
    // if (mediaStream) {
    //   mediaStream.getTracks().forEach((track) => track.stop());
    //   setMediaStream(null);
    // }
    getCamera({ exact: "environment" });
  };

  const handleCameraToggle = () => {
    setSelectedCamera(selectedCamera === "user" ? "environment" : "user");

    setCamIndex((index + 1) % vid.length);
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

    // console.log("Captured image:", imageDataUrl);
    setImages((prev) => [...prev, { _id: uuidv4(), url: imageDataUrl }]);
  };

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((e) => e._id !== id));
  };

  useEffect(() => {
    selectedCamera === "user" && openFrontCam();
    selectedCamera === "environment" && openBackCam();

    // navigator.mediaDevices
    //   .getUserMedia(constraints)
    //   .then((stream) => {
    //     videoRef.current.srcObject = stream;
    //   })
    //   .catch((error) => {
    //     console.error("Error accessing camera:", error);
    //   });
    // console.log(constraints);
  }, [selectedCamera, camIndex, aspectRatio]);

  // console.log(constraints);
  // // ----------------------

  return (
    <div className="camera-app">
      {getCamErr ? (
        <h3>Camera not Found !</h3>
      ) : (
        <div className="camera-view">
          <video ref={videoRef} autoPlay playsInline />
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      )}

      <div className="camera-controls">
        {/* <button onClick={handleCameraToggle}>Toggle Camera</button> */}
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
        <button onClick={handleCaptureImage}>Capture Image</button>
      </div>

      <div>
        <button onClick={() => setSelectedCamera("user")}>
          Open Front Camera
        </button>
        <button onClick={() => setSelectedCamera("environment")}>
          Open Back Camera
        </button>
      </div>

      <div>
        <h1>Captured Images</h1>

        <div>
          {images.map(({ _id, url }) => {
            return (
              <div key={_id}>
                <img src={url} alt="captured images"></img>
                <button onClick={() => handleDelete(_id)}>delete</button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Camera;
