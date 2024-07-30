import { Circles } from "react-loader-spinner";
const Loader = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <Circles
        height="80"
        width="80"
        color="#4fa94d"
        ariaLabel="circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
      <p className="ml-2">Loading...</p>
    </div>
  );
};

export default Loader;
