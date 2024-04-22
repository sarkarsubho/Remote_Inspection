import AddIcon from "@mui/icons-material/Add";
import CameraIcon from "@mui/icons-material/Camera";
import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { addToAlbum } from "../redux/app/action";
import "./gallery.css";

const Camera = () => {
  const dispatch = useDispatch();

  const [mediaStream, setMediaStream] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState("user"); // environment
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasDimensionRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
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
    getCamera({ exact: "environment" });
  };

  const handleCameraToggle = () => {
    setSelectedCamera(selectedCamera === "user" ? "environment" : "user");
  };

  const handleAspectRatioChange = (newAspectRatio) => {
    setAspectRatio(newAspectRatio);
  };

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

    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageDataUrl = canvas.toDataURL("image/jpeg");
    // Here capturing the the image in base64 string and added a unique id as for unique identification for

    // console.log("Captured image:", imageDataUrl);
   
    let newPhoto = { _id: uuidv4(), url: imageDataUrl };
    dispatch(addToAlbum(newPhoto));
  };

  // zoom fn

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
              }}
            />
            <canvas
              ref={canvasRef}
              style={{
                display: "none",
                width: "100%",
                height: "100%",
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
            <CameraIcon />
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
            <CameraswitchIcon />
          </IconButton>
        </Stack>
      </Box>

      <div className="camera-controls">
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
      </div>
    </div>
  );
};

export default Camera;
