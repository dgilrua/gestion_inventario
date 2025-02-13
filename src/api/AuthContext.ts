import { createContext } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  user: { username: string } | null;
  login: (username: string, password: string) => Promise<string | null>;
  logout: () => void;
  checkAuthStatus: () => void;
  loading: boolean;  
}

export const AuthContext = createContext<AuthContextProps>({
  isAuthenticated: false,
  user: null,
  login: async () => null,
  logout: () => {},
  checkAuthStatus: () => {},
  loading: true, 
});

