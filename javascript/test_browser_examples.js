/**
 * Test Browser examples
 * To execute browser examples, execute command from javascript/ directory: npm run browser-examples
 */

const utils = require('splunk-sdk/lib/utils');
const staticResource = require('splunk-sdk/contrib/static-resource/index');
const path = require('path');
const spawn = require('child_process').spawn;
const fs = require('fs');
const http = require('http');
const url = require('url');
const needle = require('needle');

const DEFAULT_PORT = 6969;

let serverProxy = function (req, res) {
    let error = { d: { __messages: [{ type: "ERROR", text: "Proxy Error", code: "PROXY" }] } };

    let writeError = function () {
        res.writeHead(500, {});
        res.write(JSON.stringify(error));
        res.end();
    };

    try {
        let body = "";
        req.on('data', function (data) {
            body += data.toString("utf-8");
        });

        req.on('end', function () {
            let destination = req.headers["X-ProxyDestination".toLowerCase()];

            let options = {
                url: destination,
                method: req.method,
                headers: {
                    "Content-Length": req.headers["content-length"] || 0,
                    "Content-Type": req.headers["content-type"] || '',
                    "Authorization": req.headers["authorization"] || ''
                },
                followAllRedirects: true,
                body: body || '',
                jar: false,
                strictSSL: false,
                rejectUnauthorized: false,
                parse_response: false
            };

            try {
                needle(options.method, options.url, options.body, options)
                .then((response) => {
                    var statusCode = (response ? response.statusCode : 500) || 500;
                    var headers = (response ? response.headers : {}) || {};
                    res.writeHead(statusCode, headers);
                    res.write(response.body);
                    res.end();
                }).catch((err)=>{
                    res.write(JSON.stringify(err));
                    res.end();
                });
            }
            catch (ex) {
                writeError();
            }

        });
    }
    catch (ex) {
        writeError();
    }
};

let launchBrowser = function (file, port) {
    if (!fs.existsSync(file)) {
        throw new Error("File does not exist: " + file);
    }

    if (process.platform === "win32") {
        spawn("cmd.exe", ["/C", "start " + makeURL(file, port)]);
    }
    else {
        spawn("open", [makeURL(file, port)]);
    }
};

let launchBrowserExamples = function (port) {
    createServer(port);
    launchBrowser("browser/index.html", port);
};

let makeURL = function (file, port) {
    return "http://localhost:" + (port ? port : DEFAULT_PORT) + "/" + file;
};

let createServer = function (port) {
    // passing where is going to be the document root of resources.
    const handler = staticResource.createHandler(fs.realpathSync(path.resolve(__dirname, ".")));

    let server = http.createServer(function (request, response) {
        const path = url.parse(request.url).pathname;

        if (utils.startsWith(path, "/proxy")) {
            serverProxy(request, response);
            return;
        }

        // handle method returns true if a resource specified with the path
        // has been handled by handler and returns false otherwise.
        if (!handler.handle(path, request, response)) {
            response.writeHead(404);
            response.write('404');
            response.end();
        }
    });

    port = port || DEFAULT_PORT;
    server.listen(port);
    console.log("Running server on port: " + (port) + " -- Hit CTRL+C to exit");
};

launchBrowserExamples();
