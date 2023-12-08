# Authentication Process Documentation

This document provides an overview of the authentication process in the Next.js project, focusing on how the application connects with the Identity Gateway (IDG) using the next-auth library with custom behavior.

## Authentication Flow

The authentication flow in the application involves several key components and custom behaviors to ensure a secure and seamless user experience.

### Access Token Management

- **Page Navigation and API Interactions**: When a user navigates between pages or triggers API route interactions:

  - If the access token is not expired, it continues to be used for authentication.
  - If the access token has expired, the application attempts to refresh it using the refresh token.

- **Refresh Token Behavior**:
  - This allows users to extend their access token while using the app.
  - If the refresh token has also expired, the application raises an error and redirects the user to the sign-in page.

### User Idle Timeout

- **Idle Detection**: If a user has a page open in their browser for an extended period without triggering SSR page loads or API route interactions:

  - After 10 minutes of user inactivity (no mouse/keyboard interaction), the user is considered idle.
  - When the user becomes idle, the application automatically logs them out to ensure security.

- **Active Engagement**: If the user remains actively engaged with the page (scrolling, mouse movement, etc.), they are not considered idle.
  - In this case, the application does not log them out automatically.
  - Instead, it attempts to refresh their token the next time they perform an SSR action.

## Custom Behavior and Configuration

The described authentication process includes custom behavior built on top of the next-auth library to enhance user experience and security. The configuration for next-auth resides in the `/src/pages/api/[...nextauth].ts` file.

- **Configuration File**: The `/src/pages/api/[...nextauth].ts` file contains the configuration settings for next-auth.
  - This file defines the authentication providers, JWT strategies, callbacks, and other settings used in the authentication process.
  - It allows customization of authentication behavior to fit the specific requirements of the application.

## Client-Side Idle Session Handling

The client-side logic for handling idle sessions is implemented in the `/src/components/organisms/Layout/RootLayout.tsx` file. This file contains the logic to detect user inactivity and perform actions accordingly:

- **Idle Detection**: The `RootLayout.tsx` file monitors user interactions, including mouse movements and keyboard inputs.

  - After 10 minutes of user inactivity, it triggers an idle state.

- **Logout on Idle**: When the idle state is detected, the user is automatically logged out for security reasons.
  - This ensures that even if the user leaves their session unattended, unauthorized access is prevented.

## Environment Variables

Several custom environment variables are used in this process:

- **`NEXTAUTH_IDLE_TIMEOUT`**: Configures the time in which a user is considered idle (defaults to 10 minutes).

- **`NEXTAUTH_SESSION_EXPIRY`**: Defines the NextAuth.js session expiry duration (defaults to 30 days). This is not related to the access token or refresh token expirations set in IDG.

- **`NEXTAUTH_SECRET`**: A randomly generated secret token that NextAuth.js uses internally to encrypt the JWT. It must be secure.

- **`NEXTAUTH_URL`**: This is the callback URL to the environment that NextAuth uses internally when interacting with IDG OIDC.

### IDG API Integration

To interact with the Identity Gateway (IDG) API for token refresh, user details retrieval, and other actions, the application relies on the following environment variables:

- **`IDG_API_URL`**: Specifies the URL for the IDG API. This URL is used to make API requests to IDG's SCIM2 endpoints.

- **`IDG_API_USERNAME`**: The username or credentials required for authentication when making requests to the IDG API.

- **`IDG_API_PASSWORD`**: The password associated with the provided username for authentication when interacting with the IDG API.

## IDG OIDC Integration

The application integrates with the Identity Gateway (IDG) using OpenID Connect (OIDC) protocols. Three environment variables are essential for this integration:

- **`AUTH_WELL_KNOWN_URL`**: This environment variable specifies the well-known URL of IDG's OIDC configuration. The well-known URL contains important information about the OIDC endpoints, such as the authorization endpoint, token endpoint, and JSON Web Key Set (JWKS) URL. The application uses this URL to discover and interact with IDG's OIDC services securely.

- **`AUTH_CLIENT_ID`**: This variable represents the client ID associated with the application in IDG. A client ID is a unique identifier assigned to the client application by the OIDC provider (IDG, in this case). The application uses this client ID to authenticate itself when making OIDC requests to IDG.

- **`AUTH_CLIENT_SECRET`**: The client secret is a confidential string that serves as a password for the application. It is also provided by IDG when registering the application as an OIDC client. The client secret is used to authenticate the client application securely during OIDC authorization code exchanges and token requests.

The combination of NextAuth.js, IDG OIDC, and IDG API provides a secure and seamless authentication experience for users, allowing them to navigate between pages, trigger API interactions, and maintain their sessions without interruptions while ensuring security through token management and idle session handling.
