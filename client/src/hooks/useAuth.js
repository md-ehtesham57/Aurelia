import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, logout as logoutAction } from '../features/auth/authSlice';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '../features/auth/authApi';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = async (credentials) => {
    const result = await loginMutation(credentials).unwrap();
    localStorage.setItem('accessToken', result.data.accessToken);
    dispatch(setUser(result.data.user));
    return result;
  };

  const register = async (data) => {
    const result = await registerMutation(data).unwrap();
    localStorage.setItem('accessToken', result.data.accessToken);
    dispatch(setUser(result.data.user));
    return result;
  };

  const logout = async () => {
    try {
      await logoutMutation();
    } catch {}
    localStorage.removeItem('accessToken');
    dispatch(logoutAction());
    navigate('/');
  };

  const hasPermission = (permission) => {
    return user?.role?.permissions?.includes(permission) ?? false;
  };

  return { user, isAuthenticated, login, register, logout, hasPermission };
};
