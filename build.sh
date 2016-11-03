# requires uglify-js
# to install `npm install -g uglify-js`
cat src/* | uglifyjs -m -c -o ./build/swarm.js
