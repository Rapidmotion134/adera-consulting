// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'http://localhost:3000/api/',
  implementation: 'HTTP',
  STRIPE_PUBLIC_KEY: 'pk_live_51QUXObJtZUwAyH7vWzkA3jTnzoSUmMwVqzihKTVQY1ubR8mtbZZ9ZaZqyVIOkIxxVxlK9leOZX84XCnEGB3uwEPa00Tyr2oloX',
  // STRIPE_PUBLIC_KEY: 'pk_test_51QUXObJtZUwAyH7vCt07aqY8N4mdsnsOkHyiBQ91Qi9sdFE9MxnpMQPhD20m9G5nFudUv1NvH1bXYxZqj8aY6INp00f16ZEqrF'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
