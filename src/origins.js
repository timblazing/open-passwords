// Where a login may be filled or saved. HTTPS anywhere; plain HTTP only on hosts that can't be
// reached from the public internet (home network, tailnet, loopback), where a NAS or router UI
// often has no certificate. Public HTTP stays blocked: anyone on the path could read the page.

const LOCAL_SUFFIXES = [".localhost", ".test", ".local", ".lan", ".home.arpa", ".internal", ".ts.net"];

function isPrivateIPv4(host) {
  const m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
  if (!m) return false;
  const [a, b] = [Number(m[1]), Number(m[2])];
  return (
    a === 127 ||
    a === 10 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254) ||
    // Tailscale CGNAT range
    (a === 100 && b >= 64 && b <= 127)
  );
}

function isPrivateIPv6(host) {
  if (!host.startsWith("[")) return false;
  const h = host.slice(1, -1);
  // loopback, unique-local fc00::/7, link-local fe80::/10
  return h === "::1" || /^f[cd][0-9a-f]{2}:/.test(h) || /^fe[89ab][0-9a-f]:/.test(h);
}

export function isPrivateNetworkHost(host) {
  if (!host) return false;
  // "nas.local." is the same name as "nas.local"
  host = host.toLowerCase().replace(/\.$/, "");
  if (host === "localhost") return true;
  if (isPrivateIPv4(host) || isPrivateIPv6(host)) return true;
  // a one-word name only resolves through the local network's DNS (truenas-scale, router)
  if (!host.includes(".") && !host.startsWith("[")) return true;
  return LOCAL_SUFFIXES.some((s) => host.endsWith(s));
}

export function canFillOn(url) {
  let u;
  try {
    u = new URL(url);
  } catch {
    return false;
  }
  if (u.protocol === "https:") return true;
  return u.protocol === "http:" && isPrivateNetworkHost(u.hostname);
}

export const NOT_SECURE_ERROR = "Not filled: this page isn't HTTPS";
