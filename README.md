# Distance Calculator Frontend

This application calculates the distance between two addresses using Google Maps API for address autocomplete and distance calculation.

## Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
# or
yarn
```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your Google Maps API key:
   ```
   PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
   PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
   PUBLIC_API_BASE_URL=your_api_base_url_here
   ```
   - Make sure to add `.env` to your `.gitignore` file

4. Get a Google Maps API key:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select an existing one
   - Enable the following APIs:
     - Places API
     - Maps JavaScript API
     - Distance Matrix API
   - Create credentials (API key)
   - Restrict the API key to your domains for security

5. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Features

- Address autocomplete using Google Places API
- Distance calculation between two addresses
- History of calculations
- Responsive design with Tailwind CSS
- Toast notifications for success/error states

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
PUBLIC_RECAPTCHA_SITE_KEY=your_recaptcha_site_key_here
PUBLIC_API_BASE_URL=your_api_base_url_here
```

## Required Environment Variables

- `PUBLIC_GOOGLE_MAPS_API_KEY`: Your Google Maps API key
- `PUBLIC_RECAPTCHA_SITE_KEY`: Your reCAPTCHA site key
- `PUBLIC_API_BASE_URL`: The base URL for your API

For production deployment, make sure to:
1. Set up the environment variables in your hosting platform
2. Restrict the API key to your production domain
3. Enable billing for the Google Cloud project to avoid quota limits

## Security Considerations

- Never commit the `.env` file to version control
- Always restrict API keys to specific domains
- Set up usage quotas in Google Cloud Console
- Monitor API usage to avoid unexpected costs
