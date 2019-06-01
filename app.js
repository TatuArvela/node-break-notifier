const os = require('os');
const notifier = require('node-notifier');
const WindowsToaster = new notifier.WindowsToaster();
const WindowsBalloon = new notifier.WindowsBalloon();
const NotifySend = new notifier.NotifySend();
const dialog = require('dialog');

var mode = 'dialog';
var arguments = process.argv;
if (arguments.includes('notification')) {
    mode = 'notification';
}
else if (arguments.includes('dialog')) {
    mode = 'dialog';
}

var timeoutStartTime;
var timeoutTime;
var timeout;

function breakTimer(minutes, mode) {
    timeoutStartTime = new Date().getTime();
    timeoutTime = minutes;
    timeout = setTimeout(function() {

    if (mode === "notification") {
        // Windows
        if (os.platform() === 'win32') {

            // 8 or 10
            if (os.release().substring(0,2) === '8.' || os.release().substring(0,2) === '10') {
                WindowsToaster.notify({
                    'title': 'Taukomuistutus',
                    'message': 'Pidä tauko, ja nouse jaloittelemaan!\nVahvista tauko klikkaamalla tätä.',
                    'wait': true
                }, function(error, response) {
                    if (response == "the user clicked on the toast.") {
                        WindowsToaster.notify({
                            'title': 'Tauko vahvistettu',
                            'message': 'Hyvä! Tauot vähentävät rasitusta.\nSeuraavasta tauosta muistutetaan 45 minuutin päästä.'
                        });
                        breakTimer(45, mode);
                    }
                    if (response == "the toast has timed out") {
                        breakTimer(10/60, mode);
                    }
                });
            }

            // Older
            else {
                WindowsBalloon.notify({
                    'title': 'Taukomuistutus',
                    'message': 'Pidä tauko, ja nouse jaloittelemaan!',
                    'type': 'info'
                }, function(error, response) {
                    WindowsBalloon.notify({
                        'title': 'Tauot vähentävät rasitusta',
                        'message': 'Seuraavasta tauosta muistutetaan 45 minuutin päästä'
                    });
                    breakTimer(45, mode);
                })
            }
        }

        // Ubuntu
        else {
            NotifySend.notify({
                'title': 'Taukomuistutus',
                'message': 'Pidä tauko, ja nouse jaloittelemaan!'
            }, function() {
                NotifySend.notify({
                    'title': 'Tauot vähentävät rasitusta',
                    'message': 'Seuraavasta tauosta muistutetaan 45 minuutin päästä'
                });
                breakTimer(45, mode);
            })
        }
    }
    if (mode === 'dialog') {
        dialog.info('Pidä tauko, ja nouse jaloittelemaan!', 'Taukomuistutus', function() {
            dialog.info('Seuraavasta tauosta muistutetaan 45 minuutin päästä', 'Tauot vähentävät rasitusta', function() {
                breakTimer(45, mode);
            })
        })
    }

    }, minutes * 60 * 1000);
}

breakTimer(1/60, mode);

setInterval(function() {
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write("Aikaa seuraavaan taukomuistutukseen: " + timeleft());
}, 1000);

function timeleft() {
    var currentTime = Math.ceil(new Date().getTime() / 1000);
    var targetTime = Math.ceil(timeoutStartTime / 1000) + timeoutTime * 60;

    var time = targetTime - currentTime;

    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;

    if (minutes < 0) {
        return "0:00";
    }
    else {
        seconds = ('0' + seconds).slice(-2);
        return minutes + ":" + seconds;
    }
}
