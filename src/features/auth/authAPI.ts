import axios from 'axios';
import { CredentialResponse, useGoogleLogin } from '@react-oauth/google';
const API_URL = 'http://localhost:8090/api/auth'; // Replace with your actual API URL

export interface User {
  id: string;
  email: string;
  name?: string;
}

interface Credentials {
  email: string;
  password: string;
}

export const loginUser = async (credentials: Credentials): Promise<User> => {
  try {
    const response = await axios.post<User>(`${API_URL}/login`, credentials);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (userData: Credentials): Promise<User> => {
  try {
    const response = await axios.post<User>(`${API_URL}/register`, userData);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await axios.post(`${API_URL}/reset-password`, { email });
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Password reset failed');
  }
};



export interface User {
  id: string;
  email: string;
name?: string;
  picture?: string;
};

let isPrompting = false;

// ...existing code...


// export const signInWithGoogle = async (): Promise<User> => {
//   if (isPrompting) return Promise.reject('Already prompting Google login');
//   isPrompting = true;

//   return new Promise((resolve, reject) => {
//     const backendOrigin = process.env.REACT_APP_BACKEND_ORIGIN || 'http://localhost:8090';
//     const frontendCallback = process.env.REACT_APP_FRONTEND_OAUTH_CALLBACK || `${window.location.origin}/oauth-callback`;
//     const oauthPath = process.env.REACT_APP_OAUTH_PATH || '/oauth2/authorization/google';
//     const oauthUrl = `${backendOrigin}${oauthPath}?redirect_uri=${encodeURIComponent(frontendCallback)}`;

//     console.debug('Opening Google OAuth popup', { oauthUrl, backendOrigin, frontendCallback });

//     // IMPORTANT: do NOT use noopener/noreferrer so popup can postMessage to opener
//     const popup = window.open(oauthUrl, 'googleSignIn', 'width=600,height=700');
//     if (!popup) {
//       isPrompting = false;
//       return reject(new Error('Failed to open popup'));
//     }
//     try { popup.focus(); } catch {}

//     let intervalId: number | undefined;
//     let timeoutId: number | undefined;

//     const cleanup = () => {
//       if (intervalId) clearInterval(intervalId);
//       if (timeoutId) clearTimeout(timeoutId);
//       window.removeEventListener('message', messageListener);
//       try { if (!popup.closed) popup.close(); } catch {}
//       isPrompting = false;
//     };

//     const resolveWithUser = (user: User) => {
//       cleanup();
//       resolve(user);
//     };
//     const rejectWithError = (err: any) => {
//       cleanup();
//       reject(err);
//     };

//     const backendOriginOnly = (() => {
//       try { return new URL(backendOrigin).origin; } catch { return backendOrigin; }
//     })();
//     const frontendOriginOnly = (() => {
//       try { return new URL(frontendCallback).origin; } catch { return window.location.origin; }
//     })();
//     const allowedOrigins = new Set([backendOriginOnly, frontendOriginOnly, window.location.origin]);

//     const messageListener = async (event: MessageEvent) => {
//       try {
//         if (!event.origin || !allowedOrigins.has(event.origin)) return;
//         const data = event.data || {};
//         if (data.type === 'oauth-success' && data.payload) {
//           // payload may be user or token
//           if (data.payload.user) return resolveWithUser(data.payload.user as User);
//           if (data.payload.token && typeof data.payload.token === 'string') {
//             // try backend /api/auth/me (cookie) first, else decode token
//             try {
//               const res = await axios.get<User>(`${backendOrigin}/api/auth/me`, { withCredentials: true });
//               return resolveWithUser(res.data);
//             } catch {
//               try {
//                 const profile = jwt_decode<any>(data.payload.token);
//                 const user: User = {
//                   id: profile.sub || profile.email || 'unknown',
//                   email: profile.email || '',
//                   name: profile.name,
//                   picture: profile.picture,
//                 };
//                 return resolveWithUser(user);
//               } catch (err) {
//                 return rejectWithError(err);
//               }
//             }
//           }
//           return resolveWithUser(data.payload as User);
//         } else if (data.type === 'oauth-error') {
//           return rejectWithError(new Error(data.error || 'OAuth error'));
//         }
//       } catch (err) {
//         rejectWithError(err);
//       }
//     };

//     window.addEventListener('message', messageListener);

//     // Poll popup to detect same-origin redirect to frontend callback and then fetch user
//     intervalId = window.setInterval(async () => {
//       try {
//         if (popup.closed) return rejectWithError(new Error('Popup closed by user'));
//         let href: string | undefined;
//         try { href = popup.location.href; } catch { return; } // still cross-origin
//         if (!href) return;

//         const callbackPath = new URL(frontendCallback).pathname;
//         if (href.includes(callbackPath)) {
//           const urlObj = new URL(href);
//           const token = urlObj.searchParams.get('token');

//           if (token) {
//             try {
//               const res = await axios.get<User>(`${backendOrigin}/api/auth/me`, { withCredentials: true });
//               return resolveWithUser(res.data);
//             } catch {
//               try {
//                 const profile = jwt_decode<any>(token);
//                 const user: User = {
//                   id: profile.sub || profile.email || 'unknown',
//                   email: profile.email || '',
//                   name: profile.name,
//                   picture: profile.picture,
//                 };
//                 return resolveWithUser(user);
//               } catch (err) {
//                 return rejectWithError(err);
//               }
//             }
//           } else {
//             try {
//               const res = await axios.get<User>(`${backendOrigin}/api/auth/me`, { withCredentials: true });
//               return resolveWithUser(res.data);
//             } catch (err) {
//               return rejectWithError(err);
//             }
//           }
//         }
//       } catch {
//         // ignore transient polling errors
//       }
//     }, 500);

//     // overall timeout
//     timeoutId = window.setTimeout(() => {
//       rejectWithError(new Error('Google sign-in timed out'));
//     }, 60_000);
//   });
// }


// authService.ts
export const signInWithGoogle = async () => {
  const backendOrigin = process.env.REACT_APP_BACKEND_ORIGIN || "http://localhost:8090";
  const frontendCallback =
    process.env.REACT_APP_FRONTEND_OAUTH_CALLBACK ||
    `${window.location.origin}/oauth-callback`;

  const oauthPath = process.env.REACT_APP_OAUTH_PATH || "/oauth2/authorization/google";
  const oauthUrl = `${backendOrigin}${oauthPath}?redirect_uri=${encodeURIComponent(frontendCallback)}`;

  // 🚀 Redirect the main browser tab (no popup)
  window.location.href = oauthUrl;
};

// ...existing code...
function jwt_decode<T>(credential: any): T {
    if (typeof credential !== 'string') {
        throw new Error('Invalid token: expected string');
    }

    const parts = credential.split('.');
    if (parts.length < 2) {
        throw new Error('Invalid JWT token');
    }

    // JWT payload is the 2nd part
    let payload = parts[1];

    // base64url -> base64
    payload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const pad = payload.length % 4;
    if (pad) {
        payload += '='.repeat(4 - pad);
    }

    try {
        // atob -> binary string; decodeURIComponent handles UTF-8 characters
        const json = decodeURIComponent(
            atob(payload)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(json) as T;
    } catch (err: any) {
        throw new Error('Failed to decode JWT payload: ' + (err?.message || err));
    }
}

