import { createAuthClient } from "better-auth/react"

// Get the base URL dynamically
const getBaseURL = () => {
  // If explicitly set, use it
  if (process.env.NEXT_PUBLIC_BETTER_AUTH_URL) {
    return process.env.NEXT_PUBLIC_BETTER_AUTH_URL;
  }
  
  // In browser, use current origin
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for development
  return "http://localhost:3000";
};

export const authClient = createAuthClient({
  baseURL: getBaseURL()
})

export const {
  signIn,
  signUp,
  signOut,
  useSession
} = authClient