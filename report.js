function printReport(pages){
    console.log("Prepairing report of links in the indicated web page...");
    console.log();
    const sortedPages = sortPages(pages)
    for (const page in sortedPages){
        console.log(`Found ${page} internal links to ${sortedPages[page]}`)
    }
}

function sortPages(pages){
    const sortedPages = Object.fromEntries(
        Object.entries(pages).sort((a,b) => a[1] - b[1])
    );
    return sortedPages
}

export { printReport }