"use client";

import { useEffect } from 'react';

function getCookie(name) {
  const v = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return v ? v[2] : null;
}

function setCookie(name, value, days = 365) {
  const d = new Date();
  d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};path=/;expires=${d.toUTCString()}`;
}

function uid() {
  // simple UUID v4-lite
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export default function VisitTracker() {
  useEffect(() => {
    try {
      // visitor id
      let visitorId = getCookie('visitor_id');
      if (!visitorId) {
        visitorId = uid();
        setCookie('visitor_id', visitorId, 365);
      }

      const payload = {
        visitorId,
        path: window.location.pathname + window.location.search,
        referrer: document.referrer || '',
        userAgent: navigator.userAgent
      };

      const base = process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const url = base + '/api/visits';

      // fire-and-forget
      navigator.sendBeacon && typeof navigator.sendBeacon === 'function'
        ? navigator.sendBeacon(url, JSON.stringify(payload))
        : fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    } catch (e) {
      // fail silently
      console.error('Visit tracking error', e);
    }
  }, []);

  return null;
}
