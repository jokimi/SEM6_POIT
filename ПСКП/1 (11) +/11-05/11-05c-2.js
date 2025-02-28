const async = require('async')
const rpcws = require('rpc-websockets').Client;
let ws = new rpcws('ws://localhost:4000');

let h = (x = ws) => async.parallel({
    square1: (cb) => {
        ws.call('square', [3])
            .catch((e) => cb(e, null))
            .then((r) => { cb(null, r) })
    },
    square2: (cb) => {
        ws.call('square', [5, 4])
            .catch((e)=>cb(e,null))
            .then((r)=>{cb(null,r)})
    },
    sum1: (cb) => {
        ws.call('sum', [2])
            .catch((e) => cb(e, null))
            .then((r) => { cb(null, r) })
    },
    sum2: (cb) => {
        ws.call('sum', [2, 4, 6, 8, 10])
            .catch((e) => cb(e, null))
            .then((r) => { cb(null, r) })
    },
    mul1: (cb) => {
        ws.call('mul', [3])
            .catch((e) => cb(e, null))
            .then((r) => { cb(null, r) })
    },
    mul2: (cb) => {
        ws.call('mul', [3, 5, 7, 9, 11, 13])
            .catch((e) => cb(e, null))
            .then((r) => { cb(null, r) })
    },
    fib1: (cb) => {
        ws.login({ login: '1111', password: '1111' })
            .then((login) => {
                if (login) {
                    ws.call('fib', [1])
                        .catch((e) => cb(e, null))
                        .then((r) => cb(null, r));
                }
                else {
                    cb({ message1: 'Ошибка авторизации' }, null);
                }
            })
    },
    fib2: (cb) => {
        ws.login({ login: '1111', password: '1111' })
            .then((login) => {
                if (login) {
                    ws.call('fib', [2])
                        .catch((e) => cb(e, null))
                        .then((r) => cb(null, r));
                }
                else {
                    cb({ message2: 'Ошибка авторизации' }, null);
                }
            })
    },
    fib3: (cb) => {
        ws.login({ login: '1111', password: '1111' })
            .then((login) => {
                if (login) {
                    ws.call('fib', [7])
                        .catch((e) => cb(e, null))
                        .then((r) => cb(null, r));
                    }
                else {
                    cb({ message3: 'Ошибка авторизации' }, null);
                }
            })
    },
    fact1: (cb) => {
        ws.login({ login: '1111', password: '1111' })
            .then((login) => {
                if (login) {
                    ws.call('fact', [0])
                        .catch((e) => cb(e, null))
                        .then((r) => cb(null, r));
                }
                else {
                    cb({ message4: 'Ошибка авторизации' }, null);
                }
            })
    },
    fact2: (cb) => {
        ws.login({ login: '1111', password: '1111' })
            .then((login) => {
                if (login) {
                    ws.call('fact', [5])
                        .catch((e) => cb(e, null))
                        .then((r) => cb(null, r));
                }
                else {
                    cb({ message5: 'Ошибка авторизации' }, null);
                }
            })
    },
    fact3: (cb) => {
        ws.login({ login: '1111', password: '1111' })
            .then((login) => {
                if (login) {
                    ws.call('fact', [10])
                        .catch((e) => cb(e, null))
                        .then((r) => cb(null, r));
                }
                else {
                    cb({ message6: 'Ошибка авторизации' }, null);
                }
            })
    }
}, (e,r) => {
    if (e) {
        console.log('e = ', e);
    }
    else {
        console.log('r = ', r);
    }
    ws.close();
});

ws.on('open', h)