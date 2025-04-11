# Google Cloud Setup Guide for Daily Reflection Journal

This guide will walk you through setting up Google authentication for your Daily Reflection Journal app.

## Step 1: Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. Click on the project dropdown at the top of the page
4. Click on "New Project"
5. Enter a project name (e.g., "Daily Reflection Journal")
6. Click "Create"

![Create New Project](https://i.imgur.com/JZGvDJq.png)

## Step 2: Enable the Google Drive API

1. In your new project, go to the navigation menu (☰) and select "APIs & Services" > "Library"
2. Search for "Google Drive API"
3. Click on "Google Drive API" in the results
4. Click "Enable"

![Enable Google Drive API](https://i.imgur.com/8JYvJZS.png)

## Step 3: Configure OAuth Consent Screen

1. In the navigation menu, go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace account)
3. Click "Create"

![OAuth Consent Screen](https://i.imgur.com/QXtLJYL.png)

4. Fill in the required information:
   - App name: "Daily Reflection Journal"
   - User support email: Your email address
   - Developer contact information: Your email address
5. Click "Save and Continue"

6. On the "Scopes" page, click "Add or Remove Scopes"
7. Add the following scopes:
   - `https://www.googleapis.com/auth/drive.file` (For Google Drive access)
   - `https://www.googleapis.com/auth/userinfo.profile` (For user profile)
   - `https://www.googleapis.com/auth/userinfo.email` (For user email)
8. Click "Save and Continue"

![Add Scopes](https://i.imgur.com/YQZfDWO.png)

9. On the "Test users" page, click "Add Users"
10. Add your email address
11. Click "Save and Continue"
12. Review your settings and click "Back to Dashboard"

## Step 4: Create OAuth Credentials

1. In the navigation menu, go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" and select "OAuth client ID"

![Create Credentials](https://i.imgur.com/JnCZXJL.png)

3. For Application type, select "Web application"
4. Name: "Daily Reflection Journal Web Client"
5. Under "Authorized JavaScript origins", click "Add URI"
6. Add the following URIs:
   - `http://localhost:5173` (for local development with Vite)
   - `http://localhost:3000` (as a backup for other development servers)
   - Your production domain if you have one (e.g., `https://your-app-domain.com`)

![Add JavaScript Origins](https://i.imgur.com/0Hs5Qqj.png)

7. Click "Create"
8. A popup will appear with your client ID and client secret. Copy the **Client ID** (you don't need the client secret for this application)

![Client ID Created](https://i.imgur.com/XYZrLmP.png)

## Step 5: Update Your Application

1. Open your project's `.env` file
2. Replace the placeholder with your actual Google Client ID:

```
VITE_GOOGLE_CLIENT_ID=your-actual-client-id-from-google-cloud-console
```

For example:
```
VITE_GOOGLE_CLIENT_ID=123456789012-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```

3. Save the file

## Step 6: Test Your Application

1. Start your application with `npm run dev`
2. Click the "Sign in with Google" button
3. You should see the Google sign-in popup
4. After signing in, you should be able to use Google Drive for storage

## Troubleshooting

### "Error 400: redirect_uri_mismatch"
- Make sure the URL you're accessing your app from exactly matches one of the authorized JavaScript origins
- If using a different port, add that origin to your authorized JavaScript origins list

### "Error 403: access_denied"
- Check that you've enabled the correct APIs
- Verify that you've added the necessary scopes to your OAuth consent screen

### "Error: idpiframe_initialization_failed"
- This usually means there's an issue with your client ID
- Double-check that you've copied the correct client ID to your `.env` file
- Make sure your app is being served over HTTPS if accessing from a production domain

## Moving to Production

When you're ready to deploy your app to production:

1. Go back to the Google Cloud Console > APIs & Services > Credentials
2. Edit your OAuth client ID
3. Add your production domain to the authorized JavaScript origins
4. If your app is in production use, you may need to verify your app through the OAuth consent screen verification process

## Publishing Your OAuth App (Optional)

If you plan to make your app available to more than 100 users:

1. Go to "OAuth consent screen"
2. Add any required information (privacy policy URL, etc.)
3. Click "Submit for verification"
4. Google will review your app and approve it for public use

This process can take several days to complete.
