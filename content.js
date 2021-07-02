// alert("Grr")
// chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
//   const re = new RegExp('bear', 'gi')
//   const matches = 
//   document.documentElement.innerHTML.match(re)
//   sendResponse({count: matches.length})
// })

// const re = new RegExp('novel', 'gi')
// const matches = document.documentElement.innerHTML.match(re)
//const novel_list = document.getElementsByClassName('novel-list horizontal col 2')
const novels = document.querySelectorAll('li.novel-item')
novels.forEach(function (novel) {
  var name = novel.querySelector('h4')
  if (name !== null)
    name = name.innerText
  var chapter = novel.querySelectorAll('div.novel-stats')[1]
  if(chapter !== undefined)
    chapter = chapter.querySelectorAll('span')[1]
  if(chapter !== undefined)
    chapter = chapter.innerText
  if(name!==null && chapter != undefined)
    chrome.runtime.sendMessage({
      novel_title: name,
      chapter_count: chapter
    })
})
