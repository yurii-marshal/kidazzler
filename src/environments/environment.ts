// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  apiUrl: 'https://dev-api.kidazzler.com',
  // apiUrl: 'http://localhost:8900',
  mobileUrl: 'https://dev-m.kidazzler.com',
  url: 'https://dev.kidazzler.com',
  blogUrl: 'https://blog.kidazzler.com',
  twitterPost: 'https://twitter.com/intent/tweet?url=',
  defaultAvatarUrl: '/assets/images/icon-no-avatar/icon-avatar-holder.png',
  recaptcha: {
    sitekey: '6LcKBz8UAAAAAObPiMBl9sA-7Ud3OiUj0YiiTpNy',
  },
  facebookAppId: '1556911227717513',
  facebookAnalyticsId: null,
  gaId: null,
  androidAppPageUrl: 'https://play.google.com/store/apps/details?id=com.kidazzler.app',
  iosAppPageUrl: 'https://itunes.apple.com/us/app/kidazzler/id1385648948?ls=1&amp;mt=8',
  mapBoxAccessToken: 'pk.eyJ1IjoiYWxleHJlaG1hbiIsImEiOiJjazJmdmljZHowbWc1M3BvMmZtYnZ3M2F0In0.c6XHHkD0TaXOLriE6AgNaQ'
};
