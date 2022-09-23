const browserify = require("browserify");
const fs = require("fs");
const outputDirectory = './appserver/static/javascript';

if (!fs.existsSync(outputDirectory)){
    fs.mkdirSync(outputDirectory, { recursive: true });
}
browserify("./appserver/static/javascript/setup_page.js")
  .transform("babelify", {
    presets: [
      "@babel/preset-env",
      "@babel/preset-react"
    ],
  })
  .bundle()
  .pipe(fs.createWriteStream(outputDirectory + "/app.js"));
