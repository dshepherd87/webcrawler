import { JSDOM } from 'jsdom';

function normalizeURL(urlString){
    const urlObj = new URL(urlString);
    let normalizedURL = `${urlObj.host}${urlObj.pathname}`;
    // remove any trailing '/' slashes
    while (normalizedURL.slice(-1) === '/'){
        normalizedURL = normalizedURL.slice(0,-1);
    };
    // remove any www. prefix if present
    normalizedURL = normalizedURL.replace('www.', '');
    // return the final result
    return normalizedURL;
}

function getURLsFromHTML(htmlBody, baseURL){
    const dom = new JSDOM(htmlBody);
    const anchors = dom.window.document.querySelectorAll('a');
    const urls = [];

    for (const anchor of anchors){
        if(anchor.hasAttribute('href')){
            let href = anchor.href;

            try {
                href = new URL(href, baseURL).href;
                urls.push(href);
            } catch(err){
                console.log(`${err.message}: ${href}`);
            } 
        };
    };

    return urls
}

async function crawlPage(baseURL, currentURL = baseURL, pages = {}) {


    // check if baseURL and currentURL have the same domain - if not, return the current pages
    const baseURLobj = new URL(baseURL)
    const currentURLobj = new URL(currentURL)
    
    if (currentURLobj.hostname != baseURLobj.hostname){
        return pages
    }

    // get a normalized version of the current URL
    let normalizedCurrentURL = normalizeURL(currentURL)
    // if the URL has already been checked, increment the count. Otherwise, create a new entry for it
    if (`${normalizedCurrentURL}` in pages ){
        pages[normalizedCurrentURL] ++
        return pages
    } 

    pages[normalizedCurrentURL] = 1

    // fetch and parse the html of the currentURL
    //console.log(`crawling ${currentURL}`)
    
    let htmlText = ''

    try {
        htmlText = await fetchHTML(currentURL)
    } catch (err) {
        console.log(`${err.message}`)
        return pages
    }
    const urls = getURLsFromHTML(htmlText, baseURL)
    for (let url of urls){
        //pages.push(crawlPage(baseURL, url, pages))
        pages = await crawlPage(baseURL, url, pages)
    }
    return pages
  }


async function fetchHTML(currentURL){
    let result
    try {
      result = await fetch(currentURL)
    } catch (err) {
      //throw new Error('Network error:',err.message)
      throw new Error(`Network error: ${err.message}`)
    }
  
    if (result.status > 399) {
      console.log(`Got HTTP error: ${result.status} ${result.statusText}`)
      return
    }
  
    const contentType = result.headers.get('content-type')
    if (!contentType || !contentType.includes('text/html')) {
      console.log('Got non-HTML response:',contentType)
      return
    }

    //let htmlText = await result.text()
    //return htmlText
    return result.text()
}

export { normalizeURL, getURLsFromHTML, crawlPage };