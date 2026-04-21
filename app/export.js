// JSON export + URL-hash share.

import { getAllResults } from './state.js';

export function snapshot() {
  const out = {};
  for (const [k, v] of getAllResults()) out[k] = v;
  return {
    version: 1,
    timestamp: new Date().toISOString(),
    ua: navigator.userAgent,
    results: out,
  };
}

export function downloadJson() {
  const data = snapshot();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `browser-capabilities-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function b64urlEncode(bytes) {
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function b64urlDecode(str) {
  const pad = str.length % 4 === 0 ? '' : '='.repeat(4 - (str.length % 4));
  const bin = atob(str.replace(/-/g, '+').replace(/_/g, '/') + pad);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export async function buildShareUrl() {
  const data = snapshot();
  const json = JSON.stringify(data);
  let payload;
  if (typeof CompressionStream !== 'undefined') {
    try {
      const stream = new Blob([json]).stream().pipeThrough(new CompressionStream('gzip'));
      const buf = await new Response(stream).arrayBuffer();
      payload = 'gz.' + b64urlEncode(new Uint8Array(buf));
    } catch {
      payload = 'v1.' + b64urlEncode(new TextEncoder().encode(json));
    }
  } else {
    payload = 'v1.' + b64urlEncode(new TextEncoder().encode(json));
  }
  const url = new URL(location.href);
  url.hash = 's=' + payload;
  return url.toString();
}

export async function readSharedFromHash() {
  const m = /[#&]s=([^&]+)/.exec(location.hash);
  if (!m) return null;
  const raw = m[1];
  try {
    if (raw.startsWith('gz.') && typeof DecompressionStream !== 'undefined') {
      const bytes = b64urlDecode(raw.slice(3));
      const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip'));
      const text = await new Response(stream).text();
      return JSON.parse(text);
    }
    if (raw.startsWith('v1.')) {
      const bytes = b64urlDecode(raw.slice(3));
      return JSON.parse(new TextDecoder().decode(bytes));
    }
  } catch (err) {
    console.warn('Failed to decode shared snapshot', err);
  }
  return null;
}

export async function copyShareUrl() {
  const url = await buildShareUrl();
  try {
    await navigator.clipboard.writeText(url);
    return { url, copied: true };
  } catch {
    return { url, copied: false };
  }
}
