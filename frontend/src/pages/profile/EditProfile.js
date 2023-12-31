import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Card from "../../components/card/Card";
import Loader from "../../components/loader/Loader";
import { selectUser } from "../../redux/features/auth/authSlice";
import "./Profile.scss";
import { toast } from "react-toastify";
import { updateUser } from "../../services/authService";
import ChangePassword from "../../components/changePassword/ChangePassword";
import ImageCropper from "../../pages/profile/imageCropper";

const EditProfile = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser);

  // Cropper Code

  const [image, setImage] = useState("");
  const [currentPage, setCurrentPage] = useState("choose-img");
  const [imgAfterCrop, setImgAfterCrop] = useState("");

  // Invoked when new image file is selected
  const onImageSelected = (selectedImg) => {
    setImage(selectedImg);
    setCurrentPage("crop-img");
  };

  // Generating Cropped Image When Done Button Clicked
  const onCropDone = (imgCroppedArea) => {
    const canvasEle = document.createElement("canvas");
    canvasEle.width = imgCroppedArea.width;
    canvasEle.height = imgCroppedArea.height;

    const context = canvasEle.getContext("2d");

    let imageObj1 = new Image();
    imageObj1.src = image;
    imageObj1.onload = function () {
      context.drawImage(
        imageObj1,
        imgCroppedArea.x,
        imgCroppedArea.y,
        imgCroppedArea.width,
        imgCroppedArea.height,
        0,
        0,
        imgCroppedArea.width,
        imgCroppedArea.height
      );

      const dataURL = canvasEle.toDataURL("image/jpeg");

      setImgAfterCrop(dataURL);
      setCurrentPage("img-cropped");
    };
  };

  // Handle Cancel Button Click
  const onCropCancel = () => {
    setCurrentPage("choose-img");
    setImage("");
  };

  // Cropper Code End

  const initialState = {
    name: user?.name,
    email: user?.email,
    phone: user?.phone,
    address: user?.address,
    photo: user?.photo,
  };
  const [profile, setProfile] = useState(initialState);
  const [profileImage, setProfileImage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
    // Cropper
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = function (e) {
        onImageSelected(reader.result);
      };
    }
    // setProfileImage(e.target.files[0]);
  };

  const saveImage = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Handle Image upload
      let imageURL;
      if (
        profileImage &&
        (profileImage.type === "image/jpeg" ||
          profileImage.type === "image/jpg" ||
          profileImage.type === "image/png")
      ) {
        const image = new FormData();
        image.append("file", profileImage);
        image.append("cloud_name", "dbfknivuk");
        image.append("upload_preset", "saadsaad");

        // First save image to cloudinary
        const response = await fetch(
          "https://api.cloudinary.com/v1_1/dbfknivuk/image/upload",
          { method: "post", body: image }
        );
        const imgData = await response.json();
        imageURL = imgData.url;

        // Save Profile
        const formData = {
          name: profile.name,
          phone: profile.phone,
          address: profile.address,
          photo: profileImage ? imgAfterCrop : profile.photo,
          // photo: profileImage ? imageURL : profile.photo,
        };

        const data = await updateUser(formData);
        console.log(data);
        toast.success("User updated");
        navigate("/profile");
        setIsLoading(true);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Save Profile
      const formData = {
        name: profile.name,
        phone: profile.phone,
        address: profile.address,
      };

      const data = await updateUser(formData);
      console.log(data);
      toast.success("User updated");
      navigate("/profile");
      setIsLoading(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <div className="profile --my2">
      {isLoading && <Loader />}

      <Card cardClass={"card --flex-dir-column"}>
        <form className="--form-control --m" onSubmit={saveProfile}>
          <span className="profile-data">
            <p>
              <label>Name:</label>
              <input
                type="text"
                name="name"
                value={profile?.name}
                onChange={handleInputChange}
                className="edit-profile"
              />
            </p>
            <p>
              <label>Email:</label>
              <input type="text" name="email" value={profile?.email} disabled />
              <br />
            </p>
            <p>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={profile?.phone}
                onChange={handleInputChange}
              />
            </p>

            <p>
              <label>Address:</label>
              <input
                type="text"
                name="address"
                value={profile?.address}
                onChange={handleInputChange}
              />
            </p>

            <div>
              <button className="--btn --btn-primary" onClick={saveProfile}>
                Save Changes
              </button>
            </div>
          </span>
        </form>
      </Card>
      <br />

      <Card cardClass={"cardProfile --flex-dir-column"}>
        <span className="profile-photo">
          {currentPage === "choose-img" ? (
            <p>
              <img src={user?.photo} alt="profilepic" />
            </p>
          ) : (
            <p>
              <img src={imgAfterCrop} alt="profilepic" />
            </p>
          )}
          ;
        </span>
        {/* <p>
          <label>Photo:</label>
          <input type="file" name="image" onChange={handleImageChange} accept="image/*"   />
        </p> */}

        {/* Cropper ------------------------------------------------- */}
        <div className="container">
          {currentPage === "choose-img" ? (
            <p>
              <label>Photo:</label>
              <input
                type="file"
                name="image"
                onChange={handleImageChange}
                accept="image/*"
              />
            </p>
          ) : currentPage === "crop-img" ? (
            <ImageCropper
              image={image}
              onCropDone={onCropDone}
              onCropCancel={onCropCancel}
            />
          ) : (
            <div>
              <button
                onClick={() => {
                  setCurrentPage("crop-img");
                }}
                className="btn"
              >
                Crop
              </button>

              <button
                onClick={() => {
                  setCurrentPage("choose-img");
                  setImage("");
                }}
                className="btn"
              >
                New Image
              </button>
            </div>
          )}
        </div>
        {/* ----------------------------------------------- */}

        {/* Image Div */}
        <div>
          <button className="--btn --btn-primary" onClick={saveImage}>
            Change Image
          </button>
        </div>
      </Card>

      <br />
      <ChangePassword />
      <br />
    </div>
  );
};

export default EditProfile;
