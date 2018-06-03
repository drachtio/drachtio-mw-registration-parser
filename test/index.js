const test = require('blue-tape');
const fs = require('fs');
const Request = require('drachtio').Request;
const SipMessage = require('drachtio-sip').SipMessage;
var mw = require('..') ;

test('parse register', (t) => {

  let register = fs.readFileSync(`${__dirname}/data/register.txt`, 'utf8').replace(/\n/g, '\r\n');
  //console.log(register);
  const msg = new SipMessage(register);
  const req = new Request(msg, {});
  const res = {
    status: 0,
    send: (status) => this.status = status
  }
  mw(req, res, (err) => {
    //console.log(`${JSON.stringify(req.registration)}`);
    t.notOk(err, 'no error returned');
    t.equal(req.registration.type, 'register', 'detected register');
    t.equal(req.registration.expires, 3600, 'expires of 3600 parsed');
    t.equal(req.registration.contact[0].uri, 'sip:167356@10.128.77.170:5060;transport=udp;jtr=5882-1', 'uri parsed');
    t.equal(req.registration.aor, 'sip:167356@10.128.77.12', 'AOR parsed ok');
    t.end();
  });    
});

test('parse unregister', (t) => {

  let register = fs.readFileSync(`${__dirname}/data/unregister.txt`, 'utf8').replace(/\n/g, '\r\n');
  const msg = new SipMessage(register);
  const req = new Request(msg, {});
  const res = {
    status: 0,
    send: (status) => this.status = status
  }
  mw(req, res, (err) => {
    t.notOk(err, 'no error returned');
    t.equal(req.registration.type, 'unregister', 'detected unregister');
    t.equal(req.registration.contact[0].uri, 'sip:167356@10.128.77.170:5060;transport=udp;jtr=5882-1', 'uri parsed');
    t.equal(req.registration.aor, 'sip:167356@10.128.77.12', 'AOR parsed ok');
    t.end();
  });    
});
