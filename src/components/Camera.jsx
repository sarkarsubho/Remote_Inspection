import React, { useState, useRef, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useGetCams } from "../hooks/hooks";
import {
  Box,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import CameraIcon from "@mui/icons-material/Camera";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

const Camera = () => {
  const [mediaStream, setMediaStream] = useState(null);
  let [camIndex, setCamIndex] = useState(0);
  const [selectedCamera, setSelectedCamera] = useState("user"); // environment
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasDimensionRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);

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

    // setCamIndex((index + 1) % vid.length);
  };

  const handleAspectRatioChange = (newAspectRatio) => {
    setAspectRatio(newAspectRatio);
  };

  function drawImageActualSize() {
    // Use the intrinsic size of image in CSS pixels for the canvas element
    canvas.width = this.naturalWidth;
    canvas.height = this.naturalHeight;

    // Will draw the image as 300x227, ignoring the custom size of 60x45
    // given in the constructor
    ctx.drawImage(this, 0, 0);

    // To use the custom size we'll have to specify the scale parameters
    // using the element's width and height properties - lets draw one
    // on top in the corner:
    ctx.drawImage(this, 0, 0, this.width, this.height);
  }

  const handleCaptureImage = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    let canvasDimension = canvasDimensionRef.current;

    // console.log("canvas video", video);
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    // log

    // canvas.width = canvasDimension.offsetWidth;
    // canvas.height = canvasDimension.offsetHeight;
    // console.log(canvasDimension.offsetWidth,canvasDimension.offsetHeight,video.videoWidth,video.videoHeight);

    // const aspectRatio = video.videoWidth / video.videoHeight;
    // const canvasWidth = video.videoWidth * zoomLevel;
    // const canvasHeight = canvasWidth / aspectRatio;
    // canvas.width = canvasWidth;
    // canvas.height = canvasHeight;

    // canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    // Here capturing the the image in base64 string and added a unique id as for unique identification for
    const image = new Image(
      canvasDimension.offsetWidth,
      canvasDimension.offsetHeight
    ); // Using optional size for image
    image.onload = drawImageActualSize;

    // console.log("Captured image:", imageDataUrl);
    setImages((prev) => [...prev, { _id: uuidv4(), url: imageDataUrl }]);
  };

  const handleDelete = (id) => {
    setImages((prev) => prev.filter((e) => e._id !== id));
  };
  // zoom fnc

  const handleZoomChange = (event) => {
    const zoomValue = parseFloat(event.target.value);
    setZoomLevel(zoomValue);
    videoRef.current.style.transform = `scale(${zoomValue})`;
  };

  useEffect(() => {
    selectedCamera === "user" && openFrontCam();
    selectedCamera === "environment" && openBackCam();
  }, [selectedCamera, aspectRatio]);

  return (
    <div className="camera-app" style={{ width: "100vw", marginTop: "20px" }}>
      <Box
        className="camera-view"
        width={{
          sm: "90%",
          xs: "90%",
          md: "50%",
        }}
        style={{
          border: "1px solid",
          overflow: "hidden",
          // background:"red",

          margin: "auto",
          position: "relative",
          aspectRatio: aspectRatio.replace(":", "/"),
        }}
        ref={canvasDimensionRef}
      >
        {getCamErr ? (
          <Typography fontWeight={600} textAlign={"center"} margin={"8rem 0"}>
            Camera not Found !
          </Typography>
        ) : (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              style={{
                transform: `scale(${zoomLevel})`,
                width: "100%",
                // maxHeight: "500px",
                // aspectRatio: aspectRatio.replace(":", "/"),
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                display: "none",
                width: "100%",
                height: "100%",
                // aspectRatio: aspectRatio.replace(":", "/"),
              }}
            />
          </>
        )}
        <Stack
          position={"absolute"}
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          spacing={2}
          width={"100%"}
          zIndex={20}
          bgcolor={"red"}
          sx={{
            backgroundColor: "rgba(119,136,153,0.5)",
            bgcolor: "green",
            bottom: 0,
            width: "100%",
            padding: "0.3rem 1rem",
            // opacity:0.5
          }}
        >
          <Stack direction={"row"}>
            <RemoveIcon />
            <input
              type="range"
              min="1"
              max="3"
              step="0.1"
              value={zoomLevel}
              onChange={handleZoomChange}
              style={{ width: "40%" }}
            />
            <AddIcon />
          </Stack>
          <IconButton
            sx={{
              position: "absolute",
              left: "45%",
              // rotate: "30deg",

              backgroundColor: "lightslategray",

              "&:hover": {
                bgcolor: "green",
              },
            }}
            disabled={getCamErr}
            onClick={handleCaptureImage}
          >
            <CameraIcon
            // fontSize="large"
            // sx={{
            //   fontSize: "1.5rem",
            // }}
            ></CameraIcon>
          </IconButton>

          <IconButton
            sx={{
              backgroundColor: "lightslategray",

              "&:hover": {
                bgcolor: "green",
              },
            }}
            onClick={handleCameraToggle}
          >
            <CameraswitchIcon></CameraswitchIcon>
          </IconButton>
        </Stack>
      </Box>

      <div className="camera-controls">
        {/* <button onClick={handleCameraToggle}>Toggle Camera</button> */}
        <Stack position={"relative"} direction={"column"}></Stack>

        <Box
          padding={".5rem"}
          border={"2px solid gray"}
          borderRadius={".5rem"}
          margin={"1rem auto"}
          width={"16.5rem"}
          fontWeight={600}
        >
          <label htmlFor="aspectRatio" style={{ marginRight: "1rem" }}>
            Select Aspect Ratio:
          </label>
          <select
            id="aspectRatio"
            value={aspectRatio}
            onChange={(e) => handleAspectRatioChange(e.target.value)}
            style={{
              border: "none",
              borderBottom: "2px solid gray",
              fontWeight: 700,
              width: "4rem",
            }}
          >
            <option value="16:9">16:9</option>
            <option value="4:3">4:3</option>
            <option value="1:1">1:1</option>
          </select>
        </Box>
        {/* <button onClick={handleCaptureImage}>Capture Image</button> */}
      </div>

      {/* <div>
        <button onClick={() => setSelectedCamera("user")}>
          Open Front Camera
        </button>
        <button onClick={() => setSelectedCamera("environment")}>
          Open Back Camera
        </button>
      </div> */}

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
