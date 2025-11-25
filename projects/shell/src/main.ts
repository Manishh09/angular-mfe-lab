import { initFederation } from '@angular-architects/native-federation';

initFederation({
  'mfe-pokemon-list': 'http://localhost:4201/remoteEntry.json',
  'mfe-pokemon-details': 'http://localhost:4202/remoteEntry.json',
  'mfe-pokemon-types': 'http://localhost:4203/remoteEntry.json'
})
  .catch(err => console.error(err))
  .then(_ => import('./bootstrap'))
  .catch(err => console.error(err));
