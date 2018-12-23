const { app, ipcMain, BrowserWindow } = require('electron')
const iconv = require('iconv-lite');

let win;


function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1024,
        height: 748,
        frame: true
    })


    //win.loadURL(`http://localhost:4200`)
    win.loadURL(`file://${__dirname}/dist/well-smile/index.html`)

    //// uncomment below to open the DevTools.
    //win.webContents.openDevTools()

    // Event when the window is closed.
    win.on('closed', function () {
        win = null
    })
}

// Create window on electron intialization
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {

    // On macOS specific close process
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', function () {
    // macOS specific close process
    if (win === null) {
        createWindow()
    }
})

ipcMain.on('ping', (event, arg) => {
    // setInterval(() => {
    //     event.sender.send('count', ++count);
    // }, 500);
})


const APDU_TH = {
    CMD_SELECT: [0x00, 0xA4, 0x04, 0x00, 0x08, 0xA0, 0x00, 0x00, 0x00, 0x54, 0x48, 0x00, 0x01],
    CMD_CID: [0x80, 0xb0, 0x00, 0x04, 0x02, 0x00, 0x0d],
    CMD_THFULLNAME: [0x80, 0xb0, 0x00, 0x11, 0x02, 0x00, 0x64],
    CMD_ENFULLNAME: [0x80, 0xb0, 0x00, 0x75, 0x02, 0x00, 0x64],
    CMD_BIRTH: [0x80, 0xb0, 0x00, 0xD9, 0x02, 0x00, 0x08],
    CMD_GENDER: [0x80, 0xb0, 0x00, 0xE1, 0x02, 0x00, 0x01],
    CMD_ISSUER: [0x80, 0xb0, 0x00, 0xF6, 0x02, 0x00, 0x64],
    CMD_ISSUE: [0x80, 0xb0, 0x01, 0x67, 0x02, 0x00, 0x08],
    CMD_EXPIRE: [0x80, 0xb0, 0x01, 0x6F, 0x02, 0x00, 0x08],
    CMD_ADDRESS: [0x80, 0xb0, 0x15, 0x79, 0x02, 0x00, 0x64],
    CMD_PHOTO: [
        [0x80, 0xb0, 0x01, 0x7B, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x02, 0x7A, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x03, 0x79, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x04, 0x78, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x05, 0x77, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x06, 0x76, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x07, 0x75, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x08, 0x74, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x09, 0x73, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x0A, 0x72, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x0B, 0x71, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x0C, 0x70, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x0D, 0x6F, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x0E, 0x6E, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x0F, 0x6D, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x10, 0x6C, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x11, 0x6B, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x12, 0x6A, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x13, 0x69, 0x02, 0x00, 0xFF],
        [0x80, 0xb0, 0x14, 0x68, 0x02, 0x00, 0xFF]
    ]
}
const thaicard = {
    CMD_CID: null,
    CMD_THFULLNAME: null,
    CMD_ENFULLNAME: null,
    CMD_BIRTH: null,
    CMD_GENDER: null,
    CMD_ISSUER: null,
    CMD_ISSUE: null,
    CMD_EXPIRE: null,
    CMD_ADDRESS: null,
    CMD_PHOTO: [],
    CMD_PHOTO_RAW: '',
}

const thaicard_master = {
    citizen_id:null,
    th_name:{
      prefix: null,
      firstname: null,
      lastname: null,
    },
    en_name:{
      prefix: null,
      firstname: null,
      lastname: null,
    },
    gender:null,
    birth:null,
    issuer:null,
    issue:null,
    expire:null,
    address:{
      address1: null,
      sub_district: null,
      district: null,
      provice: null
    },
    photo :null,
}

var count = 0;

ipcMain.on('on-active-reader-card', (event_, arg) => {
    try {
        const smartcard = require('smartcard');
        const Devices = smartcard.Devices;
        const Iso7816Application = smartcard.Iso7816Application;

        const devices = new Devices();

        devices.on('device-activated', event => {
            console.log(`activated`);
            let device = event.device;
            event_.sender.send('status', `activated`);
            device.on('card-inserted', event => {
                count = 0;
                event_.sender.send('status', `inserted`);
                thaicard.CMD_PHOTO = [];
                thaicard.CMD_PHOTO_RAW = '';
                loading(event_);
                console.log(`inserted`);
                let card = event.card;
                const application = new Iso7816Application(card);
                application.issueCommand(APDU_TH.CMD_SELECT).then(response => {
                    loading(event_);
                    application.issueCommand(APDU_TH.CMD_CID).then((res) => {
                        thaicard.CMD_CID = res.data;
                        loading(event_);
                        application.issueCommand(APDU_TH.CMD_THFULLNAME).then((res) => {
                            thaicard.CMD_THFULLNAME = res.data;
                            loading(event_);
                            application.issueCommand(APDU_TH.CMD_ENFULLNAME).then((res) => {
                                thaicard.CMD_ENFULLNAME = res.data;
                                loading(event_);
                                application.issueCommand(APDU_TH.CMD_BIRTH).then((res) => {
                                    thaicard.CMD_BIRTH = res.data;
                                    loading(event_);
                                    application.issueCommand(APDU_TH.CMD_GENDER).then((res) => {
                                        thaicard.CMD_GENDER = res.data;
                                        loading(event_);
                                        application.issueCommand(APDU_TH.CMD_ISSUER).then((res) => {
                                            thaicard.CMD_ISSUER = res.data;
                                            loading(event_);
                                            application.issueCommand(APDU_TH.CMD_ISSUE).then((res) => {
                                                thaicard.CMD_ISSUE = res.data;
                                                loading(event_);
                                                application.issueCommand(APDU_TH.CMD_EXPIRE).then((res) => {
                                                    thaicard.CMD_EXPIRE = res.data;
                                                    loading(event_);
                                                    application.issueCommand(APDU_TH.CMD_ADDRESS).then((res) => {
                                                        thaicard.CMD_ADDRESS = res.data;
                                                        loading(event_);
                                                        application.issueCommand(APDU_TH.CMD_PHOTO[0]).then((res) => {
                                                            thaicard.CMD_PHOTO.push(res.data);
                                                            loading(event_);
                                                            application.issueCommand(APDU_TH.CMD_PHOTO[1]).then((res) => {
                                                                thaicard.CMD_PHOTO.push(res.data);
                                                                loading(event_);
                                                                application.issueCommand(APDU_TH.CMD_PHOTO[2]).then((res) => {
                                                                    thaicard.CMD_PHOTO.push(res.data);
                                                                    loading(event_);
                                                                    application.issueCommand(APDU_TH.CMD_PHOTO[3]).then((res) => {
                                                                        thaicard.CMD_PHOTO.push(res.data);
                                                                        loading(event_);
                                                                        application.issueCommand(APDU_TH.CMD_PHOTO[4]).then((res) => {
                                                                            thaicard.CMD_PHOTO.push(res.data);
                                                                            loading(event_);
                                                                            application.issueCommand(APDU_TH.CMD_PHOTO[5]).then((res) => {
                                                                                thaicard.CMD_PHOTO.push(res.data);
                                                                                loading(event_);
                                                                                application.issueCommand(APDU_TH.CMD_PHOTO[6]).then((res) => {
                                                                                    thaicard.CMD_PHOTO.push(res.data);
                                                                                    loading(event_);
                                                                                    application.issueCommand(APDU_TH.CMD_PHOTO[7]).then((res) => {
                                                                                        thaicard.CMD_PHOTO.push(res.data);
                                                                                        loading(event_);
                                                                                        application.issueCommand(APDU_TH.CMD_PHOTO[8]).then((res) => {
                                                                                            thaicard.CMD_PHOTO.push(res.data);
                                                                                            loading(event_);
                                                                                            application.issueCommand(APDU_TH.CMD_PHOTO[9]).then((res) => {
                                                                                                thaicard.CMD_PHOTO.push(res.data);
                                                                                                loading(event_);
                                                                                                application.issueCommand(APDU_TH.CMD_PHOTO[10]).then((res) => {
                                                                                                    thaicard.CMD_PHOTO.push(res.data);
                                                                                                    loading(event_);
                                                                                                    application.issueCommand(APDU_TH.CMD_PHOTO[11]).then((res) => {
                                                                                                        thaicard.CMD_PHOTO.push(res.data);
                                                                                                        loading(event_);
                                                                                                        application.issueCommand(APDU_TH.CMD_PHOTO[12]).then((res) => {
                                                                                                            thaicard.CMD_PHOTO.push(res.data);
                                                                                                            loading(event_);
                                                                                                            application.issueCommand(APDU_TH.CMD_PHOTO[13]).then((res) => {
                                                                                                                thaicard.CMD_PHOTO.push(res.data);
                                                                                                                loading(event_);
                                                                                                                application.issueCommand(APDU_TH.CMD_PHOTO[14]).then((res) => {
                                                                                                                    thaicard.CMD_PHOTO.push(res.data);
                                                                                                                    loading(event_);
                                                                                                                    application.issueCommand(APDU_TH.CMD_PHOTO[15]).then((res) => {
                                                                                                                        thaicard.CMD_PHOTO.push(res.data);
                                                                                                                        loading(event_);
                                                                                                                        application.issueCommand(APDU_TH.CMD_PHOTO[16]).then((res) => {
                                                                                                                            thaicard.CMD_PHOTO.push(res.data);
                                                                                                                            loading(event_);
                                                                                                                            application.issueCommand(APDU_TH.CMD_PHOTO[17]).then((res) => {
                                                                                                                                thaicard.CMD_PHOTO.push(res.data);
                                                                                                                                loading(event_);
                                                                                                                                application.issueCommand(APDU_TH.CMD_PHOTO[18]).then((res) => {
                                                                                                                                    thaicard.CMD_PHOTO.push(res.data);
                                                                                                                                    loading(event_);
                                                                                                                                    application.issueCommand(APDU_TH.CMD_PHOTO[19]).then((res) => {
                                                                                                                                        loading(event_);
                                                                                                                                        thaicard.CMD_PHOTO.push(res.data);
                                                                                                                                        console.log(`success`);
                                                                                                                                        ConverTIS620();
                                                                                                                                        event_.sender.send('response', thaicard_master);
                                                                                                                                    });
                                                                                                                                });
                                                                                                                            });
                                                                                                                        });
                                                                                                                    });
                                                                                                                });
                                                                                                            });
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        });
                                                                                    });
                                                                                });
                                                                            });
                                                                        });
                                                                    });
                                                                });
                                                            });
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                }).catch(error => {
                    event_.sender.send('status', `error`);
                    console.error('Error:', error, error.stack);
                });
            });
            device.on('card-removed', event => {
                event_.sender.send('status', `removed`);
                console.log(`removed`);
            });

        });
        devices.on('device-deactivated', event => {
            event_.sender.send('status', `deactivated`);
            console.log(`deactivated`);
        });
    } catch (e) {
        event_.sender.send('status', `error`);
        console.error(e);
    }


})


function ConverTIS620() {
    thaicard.CMD_CID = iconv.decode(Buffer.from(replaceHex20(thaicard.CMD_CID), 'hex'), "TIS-620");
    thaicard.CMD_THFULLNAME = iconv.decode(Buffer.from(replaceHex20(thaicard.CMD_THFULLNAME), 'hex'), "TIS-620");
    thaicard.CMD_ENFULLNAME = iconv.decode(Buffer.from(replaceHex20(thaicard.CMD_ENFULLNAME), 'hex'), "TIS-620");
    thaicard.CMD_BIRTH = iconv.decode(Buffer.from(replaceHex20(thaicard.CMD_BIRTH), 'hex'), "TIS-620");
    thaicard.CMD_GENDER = iconv.decode(Buffer.from(replaceHex20(thaicard.CMD_GENDER), 'hex'), "TIS-620");
    thaicard.CMD_ISSUER = iconv.decode(Buffer.from(replaceHex20(thaicard.CMD_ISSUER), 'hex'), "TIS-620");
    thaicard.CMD_ISSUE = iconv.decode(Buffer.from(replaceHex20(thaicard.CMD_ISSUE), 'hex'), "TIS-620");
    thaicard.CMD_EXPIRE = iconv.decode(Buffer.from(replaceHex20(thaicard.CMD_EXPIRE), 'hex'), "TIS-620");
    thaicard.CMD_ADDRESS = iconv.decode(Buffer.from(thaicard.CMD_ADDRESS.split('900')[0], 'hex'), "TIS-620");
    for (let i = 0; i < thaicard.CMD_PHOTO.length; i++) {
        thaicard.CMD_PHOTO[i] = iconv.decode(Buffer.from(thaicard.CMD_PHOTO[i], 'hex'), "base64").replace('kAA=', '');
        thaicard.CMD_PHOTO_RAW += thaicard.CMD_PHOTO[i];
    }

    thaicard_master.citizen_id = thaicard.CMD_CID;

    thaicard_master.en_name.prefix = thaicard.CMD_ENFULLNAME.split('#')[0];
    thaicard_master.en_name.firstname = thaicard.CMD_ENFULLNAME.split('#')[1];
    thaicard_master.en_name.lastname = thaicard.CMD_ENFULLNAME.split('#')[3];

    thaicard_master.th_name.prefix = thaicard.CMD_THFULLNAME.split('#')[0];
    thaicard_master.th_name.firstname = thaicard.CMD_THFULLNAME.split('#')[1];
    thaicard_master.th_name.lastname = thaicard.CMD_THFULLNAME.split('#')[3];
    
    thaicard_master.gender = thaicard.CMD_GENDER;
    thaicard_master.birth = thaicard.CMD_BIRTH;
    thaicard_master.issue = thaicard.CMD_ISSUE;
    thaicard_master.issuer = thaicard.CMD_ISSUER;
    thaicard_master.expire = thaicard.CMD_EXPIRE;
    
    const address =  thaicard.CMD_ADDRESS.split('####');
    
    thaicard_master.address.address1 = address[0].replace('#',' ');
    thaicard_master.address.sub_district = address[1].split('#')[0];
    thaicard_master.address.district = address[1].split('#')[1];
    thaicard_master.address.provice = address[1].split('#')[2].split(' ')[0];

    thaicard_master.photo = '';
    thaicard_master.photo = thaicard.CMD_PHOTO_RAW;

   // console.log(thaicard_master);
    
}
function replaceHex20(Hex){
    Hex = Hex.split('900')[0];
    return Hex.split('20')[0];
}
function loading(event) {
    count = count + 3;
    event.sender.send('loading', count);
    if (count == 93) {
        event.sender.send('loading', 100);
        count = 100;
        setTimeout(() => {
            event.sender.send('status', `success`);
        }, 500);
    }
}