import { IconButton, Typography } from "@mui/material";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { deleteFromAlbum } from "../redux/app/action";

const ImageGallery = () => {
  const dispatch = useDispatch();
  const { photos } = useSelector((state) => state.app);

  const handleDelete = (id) => {
    dispatch(deleteFromAlbum(id));
  };
  return (
    <div>
      <Typography
        fontWeight={600}
        textAlign={"center"}
        margin={"2rem 0"}
        fontSize={"2rem"}
      >
        Captured Images
      </Typography>
      {photos.length === 0 ? (
        <Typography
          fontWeight={600}
          textAlign={"center"}
          margin={"2rem 0"}
          fontSize={"1rem"}
        >
          No photos have been Captured yet...
        </Typography>
      ) : (
        <div className="gallery">
          {photos.map(({ _id, url }) => {
            return (
              <div key={_id} className="card">
                <img src={url} alt="captured images"></img>
                <IconButton
                  sx={{
                    position: "absolute",
                    right: 5,
                    top: 5,
                    backgroundColor: "rgba(119,136,153,0.3)",
                  }}
                  onClick={() => handleDelete(_id)}
                >
                  <DeleteForeverIcon
                    color="error"
                    fontSize="large"
                  ></DeleteForeverIcon>
                </IconButton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
