document.addEventListener('DOMContentLoaded', function(){
    const bg = chrome.extension.getBackgroundPage()
    //document.getElementsByTagName("body")[0].innerHTML = ''
    
                    // chrome.storage.local.get([novel_title], function(old_novel){
                    //     const div = document.createElement('div')
                    //     old_chapter_count = old_novel[novel_title]
                    //     if (old_chapter_count === undefined)
                    //         old_chapter_count = 0
                    //     if (old_chapter_count !== bg.novel[novel_title])
                    //         div.textContent = `${novel_title}: ${old_chapter_count} => ${bg.novel[novel_title]}`
                    //     document.body.appendChild(div)
                    //     chrome.storage.local.set({novel_title: bg.novel[novel_title]})
                    // });
        let request = indexedDB.open("records", 1);
  
        request.onupgradeneeded = function() {
        // Initialize new database
            let db = request.result;
            if (!db.objectStoreNames.contains('books')) { 
                db.createObjectStore('books', {keyPath: 'title'})
            }
        }
        
        request.onerror = function() {
        console.error("Unable to access database", request.error);
        // Logs error to the console
        };
        
        request.onsuccess = function() {
            Object.keys(bg.novel).forEach(function(novel_title){
                let db = request.result;
                // Use existing database
                let transaction = db.transaction("books", "readwrite");
    
                // Access an object store
                let bookStore = transaction.objectStore("books");

                novelAlreadyRecorded = false;

                const getCursorRequest = bookStore.openCursor();
                getCursorRequest.onsuccess = e => {
                    // Cursor logic here
                    const cursor = e.target.result
                    if (cursor) {
                        if (cursor.value.title === novel_title) {
                            novelAlreadyRecorded = true
                            const book = cursor.value;
                            if(book.chapter_count !== bg.novel[novel_title])
                            {
                                const div = document.createElement('div')
                                div.textContent = `${novel_title}: ${book.chapter_count} => ${bg.novel[novel_title]}`
                                document.body.appendChild(div)
                                book.chapter_count = bg.novel[novel_title];
                                const updateRequest = cursor.update(book);
                            }
                        }
                        cursor.continue();
                    } 
                }
                
                if(!novelAlreadyRecorded)
                {
                    // Create an object
                    let book = {
                    title: novel_title,
                    chapter_count : bg.novel[novel_title]
                    };
                    
                    // Add an object 
                    let request = bookStore.add(book);
                    
                    // Success
                    request.onsuccess = function() {
                        const div = document.createElement('div')
                        div.textContent = `${novel_title}: 0 Chapters => ${bg.novel[novel_title]}`
                        document.body.appendChild(div)
                    console.log("Book added", request.result);
                    };
                    
                    // Failed
                    request.onerror = function() {
                    console.log("Book addition failed", request.error);
                    };
                }
            })
        };
}, false)