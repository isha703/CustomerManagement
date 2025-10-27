import { useAppDispatch, useAppSelector } from '../../../app/store/hooks';
import { setLoggedUser, setUser, resetAuth } from '../authSlice';
import { selectUser } from '../authSlice';

type User = {
  id?: string;
  name?: string;
  email?: string;
  // add other fields from your real auth model as needed
  [key: string]: any;
};

export function useAuthConfig() {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectUser);

 
  const setNewUser = (payload: Partial<User>) => {
    dispatch(setUser(payload));
  };



  const clearAuth = () => {
    dispatch(resetAuth());
  };

  return { user, setNewUser, clearAuth };
}

export default useAuthConfig;