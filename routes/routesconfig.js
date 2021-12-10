const { exec } = require('child_process');
const fs = require('fs');
const config = require('../config.json');
const package = require('../package.json');
const iconv = require('iconv-lite');

module.exports = (app) => {
    app.get('/Version', (req, res) => {
        console.log('Package version = ', package.version);
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        
        res.send(package.version);
        res.end();
    });

    app.post('/GetData', (req, res) => {
        console.log('/GetData');
        let params = {
            computer: config.computer,
            printer: config.printer
        };
        console.log('GetData - ok');
        res.set('Access-Control-Allow-Origin', '*');
        res.send(params);
        res.end();
    });

    app.post('/SetData', (req, res) => {
        console.log('/SetData');

        let data = req.body;
        console.log('data = ', data);

        let configJson = {
            computer: data.reg.computer,
            printer: data.reg.printer
        };
        console.log(JSON.stringify(configJson));
        fs.writeFile('config.json', JSON.stringify(configJson), {overwrite: true}, error => {
            if(error){
                console.log('error = ', error);
            } else {
                console.log('SetData - ok');
            }
        });
        res.set('Access-Control-Allow-Origin', '*');
        res.end();
    });

    app.post('/Print', (req, res) => {
        console.log('Print route start');
        let data = req.body;
        let buf = Buffer.from(data.body, 'base64').toString('utf8');
        console.log('buf = ', buf);

        let filePath = __dirname;
        let fileName = 'Print.txt';
        if (fs.existsSync(filePath + fileName)) {
            fs.unlinkSync(filePath + fileName);
        }
        fs.writeFileSync(filePath + '/' + fileName, iconv.encode(buf,'win1251'));
        
        let iswindow = true;
        let OS = process.platform;
        
        if(OS!=='win32'){
            iswindow = false;  
        }

        if(iswindow){
            exec(`c:\\windows\\system32\\cmd.exe /C "copy ${fileName} \\\\${config.computer}\\${config.printer}"`, {cwd: filePath}, (error) => {
            if(error){
                console.log('error = ',error.message);
                return;
            }
        });
        } else {
            exec(`/usr/bin/lp ${config.printer} -o raw routes/${fileName}`);
            exec('ls -la');
            console.log(`/usr/bin/lp ${config.printer} -o raw routes/${fileName}`);
        }
        console.log('Sent to print queue');
        console.log('Print route end');
        // Website you wish to allow to connect
        res.setHeader('Access-Control-Allow-Origin', '*');

        // Request methods you wish to allow
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

        // Request headers you wish to allow
        res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

        // Set to true if you need the website to include cookies in the requests sent
        // to the API (e.g. in case you use sessions)
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.send('OK');
        res.end();
    });
};
