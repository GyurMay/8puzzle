const { endianness } = require("os");

// JavaScript source code
fs = require("fs");
https = require("http")
n = 0;
function getImg(n, l) {
    e = `https://picsum.photos/210/210.jpg`;
    https.get("http://api.resmush.it/ws.php?img="+e, (s) => {
        b = [];
        dat = '';
        s.on('error', (e) => console.log(e));
        s.on('data', (ch) => dat += ch);
        s.on('end', () => {
            console.log(dat, b);
            /*buffer = Buffer.concat(b);
            console.log(buffer);*/
            console.log("making second call", JSON.parse(dat).dest);
            dp(JSON.parse(dat).dest, n, l);
        });
    });
}
function dp(url, n, l) {
    https.get(url, (s) => {
        b = [];
        dat = '';
        s.on('error', (e) => console.log(e));
        s.on('data', (ch) => b.push(ch));
        s.on('end', () => {
            buffer = Buffer.concat(b);
            console.log(buffer);

            fs.writeFile(`sampleImage${n}.jpg`, buffer, (s) => {
                console.log(`sampleImage${n}.jpg written`, s);
                if (n++ < l) getImg(n);
            });
        });
    });
}
e = `https://scontent-lga3-2.cdninstagram.com/v/t51.2885-19/280513477_367944811971867_5918223765755471547_n.jpg`;
dp(e, 1, 1); //direct download pic, 2nd >= 3rd
//getImg(1, 1);

/*
*/