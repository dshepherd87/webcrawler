import { test, expect } from "@jest/globals";
import { normalizeURL, getURLsFromHTML } from "./crawl.js";

test('test normalizeURL', () => {
    expect(normalizeURL('http://yahoo.com/')).toBe('yahoo.com');
    expect(normalizeURL('https://www.google.com//')).toBe('google.com');
    expect(normalizeURL('https://blog.boot.dev')).toBe('blog.boot.dev');
    expect(normalizeURL('http://cnn.com/world/news/')).toBe('cnn.com/world/news');
})

test ('test getURLsFromHTML', () => {
    expect(getURLsFromHTML('<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a></body></html>', "https://blog.boot.dev")).toStrictEqual(["https://blog.boot.dev/"]);
    expect(getURLsFromHTML('<html><body><a href="/maps"><span>Go to Google Maps</span></a></body></html>', "https://google.com")).toStrictEqual(["https://google.com/maps"]);
    expect(getURLsFromHTML('<html><body><a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a><a href="/maps"><span>Go to Google Maps</span></a></body></html>', "https://google.com")).toStrictEqual(["https://blog.boot.dev/","https://google.com/maps"]);
    expect(getURLsFromHTML('<html><body><p>Go to Boot.dev</p></body></html>', "https://blog.boot.dev")).toStrictEqual([]);
})