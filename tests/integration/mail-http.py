# Entire transport is an executable local capture stub: no real mail or network delivery.
import tempfile, pathlib, subprocess, os, urllib.request, urllib.error, json, time
with tempfile.TemporaryDirectory(prefix='harni-mail-http-') as folder:
    root=pathlib.Path(folder)
    stub=root/'capture.py'
    stub.write_text('#!/usr/bin/env python3\nimport sys, os, pathlib\np=pathlib.Path(os.environ["HARNI_TEST_CAPTURE"])\nwith p.open("ab") as out: out.write(b"\\n---MAIL---\\n"+sys.stdin.buffer.read())\n')
    stub.chmod(0o700)
    env=dict(os.environ,HARNI_MAIL_ENABLED='1',HARNI_MAIL_STATE_DIR=folder,HARNI_MAIL_RATE_KEY='local-test-key-not-a-production-secret',HARNI_TEST_CAPTURE=str(root/'messages.txt'))
    server=subprocess.Popen(['php','-d','sendmail_path='+str(stub),'-S','127.0.0.1:5154','-t','public'],env=env,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
    try:
        for _ in range(30):
            try: urllib.request.urlopen('http://127.0.0.1:5154/api/message.php')
            except urllib.error.HTTPError: break
            except urllib.error.URLError: time.sleep(.1)
        for kind in ['contact','subscribe']:
            payload={'kind':kind,'name':'Local Test','email':kind+'@example.org','message':'Synthetic test message','consent':True,'acknowledgement':True}
            req=urllib.request.Request('http://127.0.0.1:5154/api/message.php',data=json.dumps(payload).encode(),headers={'Origin':'http://localhost:5202','Content-Type':'application/json'})
            response=urllib.request.urlopen(req)
            body=json.loads(response.read())
            assert body['ok'] and body['copyAccepted'] and body['reference'].startswith('HM-'),body
            print('PASS: HTTP '+kind+' accepted by local capture transport, both copies created')
        captured=(root/'messages.txt').read_text()
        assert captured.count('---MAIL---')==4
        assert 'To: info@harni.uk' in captured and 'To: subscribe@harni.uk' in captured
        assert 'To: contact@example.org' in captured and 'To: subscribe@example.org' in captured
        print('PASS: exactly four captured messages; correct owner and visitor destinations; no real mail sent')
    finally:
        server.terminate();server.wait(timeout=5)
