[TC-0001]
# User signs in with Keycloak and the UI is displayed correctly
- Go to website found in environment variable ACCESSNOW_HOST
- The URL staring from the value in environment variable AUTH_HOST should be loaded
- Click the "Sign In " button
- Use environment variable TEST_USERNAME with  the username textbox
- wait for the password text to appear
- Use environment variable TEST_USER_PASSWORD with the password textbox
- Click the "Sign In" button
- The browser should load website starting from value of environment variable ACCESSNOW_HOST
