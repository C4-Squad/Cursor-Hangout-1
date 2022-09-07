let namesDisplayed = false

window.addEventListener("load", function() {
  //connect to the socket when the window loads
  const socket = io();
  const curPlr = document.getElementById("self")

  socket.on("loggedIn", (res) => {
    if (res === "ok") {
      document.onmousemove = function(e) {
        curPlr.style.top = (e.clientY - 16) + "px"
        curPlr.style.left = (e.clientX - 16) + "px"
        socket.emit("move", e.clientX / window.innerWidth, e.clientY / window.innerHeight)
      }

      document.onmousedown = function() {
        curPlr.style.borderRadius = "8px"
        socket.emit("mouseDown")
      }

      document.onmouseup = function() {
        curPlr.style.borderRadius = "50vmax"
        socket.emit("mouseUp")
      }

      document.body.onkeyup = function(e) {
        if (e.key == " " ||  e.code == "Space" ||      e.keyCode == 32 ) {
          namesDisplayed = !namesDisplayed
          const elems = document.getElementsByClassName("username")
          const divElems = document.getElementsByClassName("username")
          for (let i in elems) {
            if (namesDisplayed){
              elems[i].style.display = "block"
              divElems[i].style.paddingRight = "4px"
              divElems[i].style.paddingLeft = "4px"
            } else {
              elems[i].style.display = "none"
              divElems[i].style.paddingRight = "0px"
              divElems[i].style.paddingLeft = "0px"
            }
          }
        }
      }

      function createChar(index,name) {
        const newChar = document.createElement("div")
        newChar.classList.add("char");
        newChar.classList.add("other");
        newChar.id = index
        document.body.appendChild(newChar)
        const newName = document.createElement("p")
        newName.innerHTML = name
        newName.classList.add("username");
        if (!namesDisplayed){
          newName.style.display = "none"
        }
        newChar.appendChild(newName)
      }

      socket.on("playerJoin", (index,name) => {
        createChar(index,name)
      })

      socket.on("playerLeave", (index) => {
        document.getElementById(index.toString()).remove()
      })

      socket.on("playerMove", (index, ratioX, ratioY) => {
        const setPlayer = document.getElementById(index.toString())
        setPlayer.style.top = (ratioY * window.innerHeight) + "px"
        setPlayer.style.left = (ratioX * window.innerWidth) + "px"
      })

      socket.on("playerMouseDown", (index) => {
        document.getElementById(index.toString()).style.borderRadius = "8px"
      })

      socket.on("playerMouseUp", (index) => {
        document.getElementById(index.toString()).style.borderRadius = "50vmax"
      })
    } else {
      window.addEventListener('message', authComplete);

    var h = 500;
    var w = 350;
    var left = screen.width / 2 - w / 2;
    var top = screen.height / 2 - h / 2;

    var authWindow = window.open(
      'https://repl.it/auth_with_repl_site?domain=' + location.host,
      '_blank',
      'modal =yes, toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' +
        w +
        ', height=' +
        h +
        ', top=' +
        top +
        ', left=' +
        left,
    );

    function authComplete(e) {
      if (e.data !== 'auth_complete') {
        return;
      }

      window.removeEventListener('message', authComplete);

      authWindow.close();
        location.reload();
    }}
  })
})