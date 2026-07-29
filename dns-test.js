const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.cluster0.57r17yy.mongodb.net", (err, records) => {
    if (err) {
        console.error(err);
    } else {
        console.log(records);
    }
});