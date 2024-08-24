import { jwtDecode, JwtPayload } from 'jwt-decode';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

const BACKEND_URL = process.env.NEXT_SERVER_URL || 'http://localhost:8000';

interface CustomJwtPayload extends JwtPayload {
  email?: string;
  firstName?: string;
  lastName?: string;
}

interface AuthenticatedFetchOptions extends RequestInit {
  redirectOnAuthError?: boolean;
}

export function useAuthenticatedFetch() {
  const router = useRouter();

  const authenticatedFetch = useCallback(
    async (url: string, options: AuthenticatedFetchOptions = {}) => {
      const { redirectOnAuthError = true, ...fetchOptions } = options;

      // Get the access token from local storage
      let accessToken: string | null = localStorage.getItem('accessToken');

      // Check if the access token is expired
      if (accessToken) {
        try {
          const decodedToken = jwtDecode<CustomJwtPayload>(accessToken);
          if (Date.now() >= (decodedToken.exp ?? 0) * 1000) {
            // Token is expired, try to refresh
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
              try {
                const response = await fetch(
                  `${BACKEND_URL}/refresh?refresh_token=${encodeURIComponent(
                    refreshToken
                  )}`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  }
                );

                if (response.ok) {
                  const data = await response.json();
                  if (data.accessToken) {
                    accessToken = data.accessToken;
                    if (accessToken) {
                      localStorage.setItem('accessToken', accessToken);
                    }
                  } else {
                    throw new Error(
                      'Failed to refresh token: No access token in response'
                    );
                  }
                } else {
                  throw new Error(
                    'Failed to refresh token: ' + (await response.text())
                  );
                }
              } catch (error) {
                console.error('Error refreshing token:', error);
                if (redirectOnAuthError) {
                  // router.push('/signin');
                }
                return null;
              }
            } else {
              console.error('No refresh token available');
              if (redirectOnAuthError) {
                // router.push('/signin');
              }
              return null;
            }
          }
        } catch (error) {
          console.error('Error decoding or refreshing token:', error);
          if (redirectOnAuthError) {
            // router.push('/signin');
          }
          return null;
        }
      } else {
        if (redirectOnAuthError) {
          // router.push('/signin');
        }
        return null;
      }

      // Prepare headers
      const headers = new Headers(fetchOptions.headers);
      headers.set('Authorization', `Bearer ${accessToken}`);

      // Make the authenticated request
      try {
        const response = await fetch(`${BACKEND_URL}${url}`, {
          ...fetchOptions,
          headers,
        });

        if (response.status === 401 && redirectOnAuthError) {
          // router.push('/signin');
          return null;
        }

        return response;
      } catch (error) {
        console.error('Fetch error:', error);
        throw error;
      }
    },
    [router]
  );

  return authenticatedFetch;
}

export default useAuthenticatedFetch;
