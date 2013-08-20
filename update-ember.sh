mkdir tmp
cd tmp
git clone git://github.com/emberjs/ember.js.git ember
cd ember
bundle install
bundle exec rake dist
cd ../..
rm vendor/scripts/ember-latest.js
cp tmp/ember/dist/ember.js vendor/scripts/ember-latest.js
rm -rf tmp/ember

cd tmp
git clone git://github.com/emberjs/data.git data
cd data
bundle install
bundle exec rake dist
cd ../..
rm vendor/scripts/ember-data-latest.js
cp tmp/data/dist/ember-data.js vendor/scripts/ember-data-latest.js
rm -rf tmp/data

cd tmp
git clone https://github.com/emberjs/list-view.git
cd list-view
bundle
bundle exec rake dist
cd ../..
rm vendor/scripts/list-view.js
cp tmp/list-view/dist/modules/list-view.js vendor/scripts/list-view.js
rm -rf tmp/list-view

rmdir tmp
