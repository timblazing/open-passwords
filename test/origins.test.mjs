import { test } from "node:test";
import assert from "node:assert/strict";
import { canFillOn } from "../src/origins.js";

const allowed = [
  "https://example.com/login",
  "http://localhost:3000/",
  "http://127.0.0.1/",
  "http://[::1]:8080/",
  "http://app.localhost/",
  "http://site.test/",
  "http://truenas-scale/ui/signin",
  "http://TrueNAS-Scale/ui/signin",
  "http://nas.local/",
  "http://router.lan/",
  "http://printer.home.arpa/",
  "http://grafana.internal/",
  "http://box.tail1234.ts.net/",
  "http://10.0.0.5/",
  "http://172.16.0.1/",
  "http://172.31.255.254/",
  "http://192.168.1.1/",
  "http://169.254.10.10/",
  "http://100.64.0.1/",
  "http://100.127.255.254/",
  "http://[fd12:3456::1]/",
  "http://[fe80::1]/",
];

const blocked = [
  "http://example.com/login",
  "http://bank.co.uk/",
  "http://8.8.8.8/",
  "http://172.15.0.1/",
  "http://172.32.0.1/",
  "http://100.63.255.255/",
  "http://100.128.0.1/",
  "http://192.169.1.1/",
  "http://[2001:db8::1]/",
  "http://evil.local.example.com/",
  "http://ts.net.example.com/",
  "ftp://nas.local/",
  "file:///etc/passwd",
  "javascript:alert(1)",
  "not a url",
  "",
  undefined,
];

for (const u of allowed) test(`allows ${u}`, () => assert.equal(canFillOn(u), true));
for (const u of blocked) test(`blocks ${u}`, () => assert.equal(canFillOn(u), false));
