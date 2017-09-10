var socket = io.connect();

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
console.log("ihan mitä vaan")

// Add a "checked" symbol when clicking on a list item
var list = document.querySelector('ul');
list.addEventListener('click', function(ev) {
  if (ev.target.tagName === 'LI') {
    ev.target.classList.toggle('checked');
  }
}, false);

// Create a new list item when clicking on the "Add" button
function newElement() {
  var li = document.createElement("li");
  var inputValue = document.getElementById("myInput").value;
  var t = document.createTextNode(inputValue);
  li.appendChild(t);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("myInput").value = "";

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  delete_item();

  socket.emit('add_item', inputValue);
}

document.getElementById("myInput").addEventListener("keydown", function(e) {
    if (!e) { 
      var e = window.event;
    }
    // Enter is pressed
    if (e.keyCode == 13) { 
      newElement();
    }
});

socket.on('list_todo_items', function(items) {
  console.log("cons name: "  , items.constructor.name)  
  var list = document.getElementById("myUL");
  for(i = 0; i < items.length; i++) {
    var li = document.createElement("li");
    li.innerText = items[i];
    list.appendChild(li);
    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
  }
  delete_item();
  
})

function delete_item() {
  console.log("menee tänne: " , close.length)
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      var div = this.parentElement;
      var text = div.firstChild.textContent;
      div.style.display = "none";
      socket.emit('delete_item', text);
    }
  }
}
