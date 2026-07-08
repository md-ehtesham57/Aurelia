import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setUser, logout as logoutAction } from '../features/auth/authSlice';
import { useLoginMutation, useRegisterMutation, useLogoutMutation } from '../features/auth/authApi';
import { useMergeCartMutation } from '../features/cart/cartApi';

const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? match[2] : null;
};

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  const [loginMutation] = useLoginMutation();
  const [registerMutation] = useRegisterMutation();
  const [logoutMutation] = useLogoutMutation();
  const [mergeCart] = useMergeCartMutation();

  const login = async (credentials) => {
    const result = await loginMutation(credentials).unwrap();
    localStorage.setItem('accessToken', result.data.accessToken);
    dispatch(setUser(result.data.user));
    const sessionId = getCookie('sessionId');
    if (sessionId) {
      mergeCart(sessionId).catch(() => {});
    }
    return result;
  };

  const register = async (data) => {
    const result = await registerMutation(data).unwrap();
    localStorage.setItem('accessToken', result.data.accessToken);
    dispatch(setUser(result.data.user));
    const sessionId = getCookie('sessionId');
    if (sessionId) {
      mergeCart(sessionId).catch(() => {});
    }
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
