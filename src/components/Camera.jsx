import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const Camera = () => {
  //   const [selectedCamera, setSelectedCamera] = useState("front");
  //   const [aspectRatio, setAspectRatio] = useState("16:9");
  //   const videoRef = useRef({});

  //   const handleCameraToggle = () => {
  //     setSelectedCamera(selectedCamera === "front" ? "back" : "front");
  //   };

  //   const handleAspectRatioChange = (newAspectRatio) => {
  //     setAspectRatio(newAspectRatio);
  //   };

  //   const constraints = {
  //     video: {
  //       facingMode: selectedCamera,
  //       aspectRatio: { ideal: eval(aspectRatio.replace(":", "/")) },
  //     },
  //   };

  //   navigator.mediaDevices
  //     .getUserMedia(constraints)
  //     .then((stream) => {
  //       videoRef.current.srcObject = stream;
  //     })
  //     .catch((error) => {
  //       console.error("Error accessing camera:", error);
  //     });

  //   return (
  //     <div className="camera-app">
  //       <div className="camera-controls">
  //         <button onClick={handleCameraToggle}>Toggle Camera</button>
  //         <div>
  //           <label htmlFor="aspectRatio">Aspect Ratio:</label>
  //           <select
  //             id="aspectRatio"
  //             value={aspectRatio}
  //             onChange={(e) => handleAspectRatioChange(e.target.value)}
  //           >
  //             <option value="16:9">16:9</option>
  //             <option value="4:3">4:3</option>
  //             <option value="1:1">1:1</option>
  //           </select>
  //         </div>
  //       </div>
  //       <div className="camera-view">
  //         <video ref={videoRef} autoPlay playsInline />
  //       </div>
  //     </div>
  //   );
  let vid = [];
  navigator.mediaDevices.enumerateDevices().then((data) => {
    let deviceIds = data
      .filter((e) => e.kind === "videoinput")
      .map((e) => vid.push(e.deviceId));

    console.log("navigoter data", vid);
  });

  const [openBackCamera, setOpenBackCamera] = useState(false);
  let [camIndex, setCamIndex] = useState(0);

  const [selectedCamera, setSelectedCamera] = useState("user");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const videoRef = useRef({});
  const canvasRef = useRef(null);

  const [images, setImages] = useState([]);

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
    console.log("Captured image:", imageDataUrl);
    setImages((prev) => [...prev, { _id: uuidv4(), url: imageDataUrl }]);
  };

  const constraints = {
    video: {
      //   facingMode: selectedCamera,
      //  facingMode: { exact: "user" },
      //   facingMode: { exact: "user" },
      aspectRatio: { ideal: eval(aspectRatio.replace(":", "/")) },
    },
  };

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((e) => e._id !== id));
  };

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        video: {
          //   facingMode: selectedCamera,
          //  facingMode: { exact: "user" },
          //   facingMode: { exact: "user" },
          deviceId: { exact: vid[camIndex] },
          aspectRatio: { ideal: eval(aspectRatio.replace(":", "/")) },
        },
      })
      .then((stream) => {
        videoRef.current.srcObject = stream;
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
      });
    // console.log(constraints);
  }, [selectedCamera,camIndex]);

  console.log(constraints);
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
        <button onClick={handleCaptureImage}>Capture Image</button>
      </div>
      <div className="camera-view">
        <video ref={videoRef} autoPlay playsInline />
        <canvas ref={canvasRef} style={{ display: "none" }} />
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
