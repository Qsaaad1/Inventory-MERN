.profile {
  .card {
    max-width:  600px;
    display: flex;
    justify-content: flex-start;

    background-color: whitesmoke;

    padding: 1rem 0;

    span.profile-photo {
      text-align: center;
    }

    img {
      width: 100%;
      max-width: 350px;
      padding-right: 1rem;
      padding-left: 1rem;
    }
    span.profile-data {
      margin: 0 1rem;
    }
    span.profile-data > * {
      border-top: 1px solid #fff;
      padding: 5px 0;
    }
  }
  .cardPro{
    max-width: 600px;
    display: flex;
    justify-content: flex-start;

    padding: 1rem;
    padding: 1rem 0;
    background-color: rgb(245, 245, 245);
    span.profile-photo {
      text-align: center;
    }

    img {
      width: 100%;
      max-width: 350px;
      // margin-left: 10px;
      // padding-right: 1rem;
      // padding-left: 1rem;
      // border-radius: 20px;
      // border: 2px solid red;
    }
    span.profile-data {
      margin: 0 1rem;
    }
    span.profile-data > * {
      border-top: 1px solid #ccc;
      padding: 5px 0;
    }


  }
}
@media screen and (max-width: 600px) {
  span.profile-photo {
    margin: auto;
  }
}
