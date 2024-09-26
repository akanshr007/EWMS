import { Toaster } from "react-hot-toast";
import Application from "./Application";
import Loader from "./components/common/Loader/Loader";
import { axiosRequest, axiosResponse } from "services/axios";
import { useState } from "react";

function App() {
  const [loaderStatus, setLoaderStatus] = useState(false)

  axiosRequest(setLoaderStatus);
  axiosResponse(setLoaderStatus);

  return (
    <>
      {loaderStatus && <Loader />}
      <Toaster />
      <Application />
    </>
  );
}

export default App;
