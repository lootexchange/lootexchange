import ReactLoading from "react-loading";

const Loader = ({ size = 30, ...props }) => (
  <ReactLoading
    type="cylon"
    color="white"
    width={size}
    height={size}
    {...props}
  />
);

export default Loader;
