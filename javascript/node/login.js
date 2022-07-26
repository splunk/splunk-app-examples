let splunkjs = require('splunk-sdk');

/*
################ Login with sessionKey #################
Execute following command to create sessionKey manually: 
curl -k -u <username>:<password>  <scheme>://<host>:<port>/services/auth/login -d username=<username> -d password=<password>
*/
let serviceWithSessionKey = new splunkjs.Service(
    {
        // Replace the host if you are accessing remote host
        scheme: 'https',
        host: 'localhost',
        port: '8089',
        sessionKey: 'SESSION_KEY', // Add your session key
        version: '8',
    });

serviceWithSessionKey.get("search/jobs", { count: 2 }).then((res) => {
        console.log("Login successful with sessionKey");
    }).catch ((err) => {
        console.log(err);
    });

/* 
################ Login with token #################
Execute following command to enable token authentication:
curl -k -u <username>:<password> -X POST <scheme>://<host>:<port>/services/admin/token-auth/tokens_auth -d disabled=false

Execute following command to create bearer token manually:
curl -k -u <username>:<password> -X POST <scheme>://<host>:<port>/services/authorization/tokens?output_mode=json --data name=<username> --data audience=Users --data-urlencode expires_on=+30d
*/
let serviceWithBearerToken = new splunkjs.Service(
    {
        // Replace the host if you are accessing remote host
        scheme: 'https',
        host: 'localhost',
        port: '8089',
        sessionKey: 'TOKEN', // Add your token here
        version: '8',
    });

serviceWithBearerToken.get("search/jobs", { count: 2 }).then((res) => {
        console.log("Login successful with bearer token");
    }).catch ((err) => {
        console.log(err);
    });
