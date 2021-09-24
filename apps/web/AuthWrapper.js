import { useEffect } from "react";
import { useRecoilState } from "recoil";

import eth from "./ethers";
import { currentUser as currentUserAtom } from "./atoms";

const AuthWrapper = ({ children }) => {
  const [currentUser, setCurrentUser] = useRecoilState(currentUserAtom);
  useEffect(() => {
    const connect = async () => {
      eth.setCurrentUser = setCurrentUser;
      await eth.connect();
      setCurrentUser(eth.user);
    };

    connect();
  }, []);

  return children;
};

export default AuthWrapper;
