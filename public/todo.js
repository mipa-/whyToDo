var socket = io.connect();

// Click on a close button to hide the current list item
var close = document.getElementsByClassName("close");
var edit = document.getElementsByClassName("edit");
var editBtn = document.getElementsByClassName("save");
console.log("editBtn" , editBtn)

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

  var span1 = document.createElement("SPAN");
  var txt1 = document.createTextNode("✏️");
  span1.className = "edit";
  span1.appendChild(txt1);
  li.appendChild(span1);

  var span = document.createElement("SPAN");
  var txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  edit_item();

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

document.getElementById("myBtn").onclick = function(e){
  console.log("buttonevent")
  newElement();
}

socket.on('list_todo_items', function(items) {
  console.log("cons name: "  , items.constructor.name)  
  var list = document.getElementById("myUL");
  for(i = 0; i < items.length; i++) {
    var li = document.createElement("li");
    li.innerText = items[i];
    list.appendChild(li);

    var span1 = document.createElement("SPAN");
    var txt1 = document.createTextNode("✏️");
    span1.className = "edit";
    span1.appendChild(txt1);
    li.appendChild(span1);

    var span = document.createElement("SPAN");
    var txt = document.createTextNode("\u00D7");
    span.className = "close";
    span.appendChild(txt);
    li.appendChild(span);
  }

  edit_item();

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

function edit_item() {
  console.log("edit item")
  for (i = 0; i < edit.length; i++) {
    edit[i].onclick = function() {
      var div = this.parentElement;
      console.log("divvi" , div)
      var text = div.firstChild.textContent;
      var joo = div.children;
      div.classList.add("item_edit");
      console.log("joo " , joo)
      div.innerText = '';
      div.innerHTML = '<input type="text" id="myEdit" value="' + text 
        + '"><span id="mySaveBtn" class="save">💾</span>';
      console.log("text" , text)
//      console.log("len2" , editBtn.length)
      //socket.emit('edit_item' , text);

      console.log("len" , editBtn.length)
      for (i = 0; i < editBtn.length; i++) {
        editBtn[i].onclick = function() {
          var inputValue = document.getElementById("myEdit").value;
          console.log("value " , inputValue)
          div.innerText = '';
          //div.innerText = inputValue; 

          var li = document.createElement("li");
          var t = document.createTextNode(inputValue);
          div.appendChild(t);

          var span1 = document.createElement("SPAN");
          var txt1 = document.createTextNode("✏️");
          span1.className = "edit";
          span1.appendChild(txt1);
          div.appendChild(span1);

          var span = document.createElement("SPAN");
          var txt = document.createTextNode("\u00D7");
          span.className = "close";
          span.appendChild(txt);
          div.appendChild(span);

          div.classList.remove("item_edit");

          edit_item();

          delete_item();

          socket.emit('edit_item', text, inputValue);
        }
      }
    }
  }
}
