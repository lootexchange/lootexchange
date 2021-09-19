import { useRecoilValue } from "recoil";
import { currentUser as currentUserAtom } from "../atoms";

const useCurrentUser = () => useRecoilValue(currentUserAtom);

export default useCurrentUser;
