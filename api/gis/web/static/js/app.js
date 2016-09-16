import {Socket, LongPoller} from "./phoenix"

class App {

  static init(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    var $status    = $("#status")
    var $messages  = $("#messages")
    var $input     = $("#message-input")
    var $username  = "mm"
    var is_joined  = false
    var chan       = ""
    var $fill       = $("#fill_btn")
    socket.connect({user_id: $username})
    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))
    console.log(username)
    chan = socket.channel("polling:" + $username, {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => is_joined = true)
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))
    chan.on("register:msg", msg => {
      $messages.append(this.messageTemplate(msg))
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("user:entered", msg => {
      var username = this.sanitize(msg.user || "anonymous")
      $messages.append(`<br/><i>[${username} entered]</i>`)
    })
    $input.off("keypress").on("keypress", e => {
      if (e.keyCode == 13) {
        console.log("ENTER PUSCHED")
        if (is_joined == false) {


        }
        chan.push("register", {user: $username, objects: $input.val()})
        $input.val("")
      }
    })
    $fill.click(function(){
      var username = "mm"
      var objects = [
                  "20Camera",
                  "23Camera",
                  "26Camera",
                  "29Camera",
                  "297Camera",
                ]
//      $username.val(username)
      $input.val(JSON.stringify(objects))
    })

  }
  static sanitize(html){ return $("<div/>").text(html).html() }

  static messageTemplate(msg){
    let username = this.sanitize(msg.user || "anonymous")
    let body     = this.sanitize(msg.body)

    return(`<p><a href=''>[${username}]</a>&nbsp; ${body}</p>`)
  }

}

$( () => App.init() )

export default App