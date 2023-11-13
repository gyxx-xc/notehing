window.addEventListener("mousedown", function(e){
  if (e.button == 2)
    window.electron.startDrag()
})

window.addEventListener("mouseup", function(e){
  if (e.button == 2)
    window.electron.endDrag()
})
