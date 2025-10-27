import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
// import { login, logout, selectUser } from '../features/auth/authSlice';
// import { useQuery } from 'react-query';
// import { fetchUser } from '../features/auth/authAPI';

// const useAuth = () => {
//   const dispatch = useDispatch();
//   const user = useSelector(selectUser);

//   const { data, error, isLoading } = useQuery('user', fetchUser, {
//     enabled: !!user,
//   });

//   // useEffect(() => {
//   //   if (data) {
//   //     dispatch(login(data));
//   //   }
//   // }, [data, dispatch]);

//   const handleLogout = () => {
//     dispatch(logout());
//   };

//   return {
//     user,
//     isLoading,
//     error,
//     handleLogout,
//   };
// };

//export default useAuth;