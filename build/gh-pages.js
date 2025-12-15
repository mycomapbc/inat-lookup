// to use, run `npm run update-gh-pages` in the root folder.
var ghpages = require('gh-pages');

ghpages.publish('dist', function (err) {
  if (!err) {
    console.log('Github pages doc updated.');
  }
});
