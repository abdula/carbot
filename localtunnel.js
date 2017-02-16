var ngrok = require('ngrok');
var opts = {
    addr: 3000,
    authtoken: '39kYLyGp6A2yftvsjt8eV_2xpc5J75HijmnzHpo5zQr'
};

ngrok.connect(opts, function(err, url) {
    if (err) {
        console.log(err);
    }
    console.log(url);
});