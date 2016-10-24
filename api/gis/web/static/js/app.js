import {Socket, LongPoller} from "./phoenix"

class App {

  static init(){
    let socket = new Socket("/socket", {
      logger: ((kind, msg, data) => { console.log(`${kind}: ${msg}`, data) })
    })

    var $status    = $("#status")
    var $messages  = $("#messages")
    var $input     = $("#message-input")
    var $username  = $("#username")
    var is_joined  = false
    var chan       = ""
    var $fill       = $("#fill1_btn")
    var $fill2       = $("#fill2_btn")
    var $fill3       = $("#fill3_btn")
    var $random    = $("#btn_random")

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
    socket.connect({user_id: $username.val()})
    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))
    chan = socket.channel("polling:" + $username.val(), {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => is_joined = true)
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))
    chan.on("register:start", msg => {
      $messages.append(this.messageTemplate(msg))
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("user:entered", msg => {
      var username = this.sanitize(msg.user || "anonymous")
      $messages.append(`<br/><i>[${username} entered]</i>`)
    })
      var objects = [
                  "20Camera",
                  "23Camera",
                  "26Camera",
                  "29Camera",
                  "297Camera",
                ]
//      $username.val(username)
      $input.val(objects)
      chan.push("register", {user: $username.val(), objects: objects})

    })
    $fill2.click(function(){
//          var username = "mm"
    socket.connect({user_id: $username.val()})
    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))
    chan = socket.channel("polling:" + $username.val(), {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => is_joined = true)
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))
    chan.on("register:start", msg => {
      $messages.append(this.messageTemplate(msg))
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("user:entered", msg => {
      var username = this.sanitize(msg.user || "anonymous")
      $messages.append(`<br/><i>[${username} entered]</i>`)
    })
          var objects = [
                      "80001Camera",
                      "80005Camera",
                      "80009Camera",
                      "80013Camera",
                      "80017Camera",
                    ]
    //      $username.val(username)
          $input.val(objects)
          chan.push("register", {user: $username.val(), objects: objects})

        })
    $fill3.click(function(){
//      var username = "mm"
    socket.connect({user_id: $username.val()})
    socket.onOpen( ev => console.log("OPEN", ev) )
    socket.onError( ev => console.log("ERROR", ev) )
    socket.onClose( e => console.log("CLOSE", e))
    chan = socket.channel("polling:" + $username.val(), {})
    chan.join().receive("ignore", () => console.log("auth error"))
               .receive("ok", () => is_joined = true)
    chan.onError(e => console.log("something went wrong", e))
    chan.onClose(e => console.log("channel closed", e))
    chan.on("register:start", msg => {
      $messages.append(this.messageTemplate(msg))
      scrollTo(0, document.body.scrollHeight)
    })

    chan.on("user:entered", msg => {
      var username = this.sanitize(msg.user || "anonymous")
      $messages.append(`<br/><i>[${username} entered]</i>`)
    })
      var objects = [
                    "80017Camera",
                    "80025Camera",
                    "80029Camera",
                    "80033Camera",
                    "80037Camera",
                ]
//      $username.val(username)
      $input.val(objects)
      chan.push("register", {user: $username.val(), objects: objects})

    })
  $random.click(function(){
    var userlist = ["admin", "tkk", "rm", "milu", "MiLu2", "rt", "kamz", "mpb", "lm", "l2", "l3", "l4",
                "tkk_test", "rg", "la", "mp", "mpi", "pp", "kh", "hekr", "seconet", "lj", "grsy",
                "ms", "czmi", "julo", "ad", "pg", "pg3", "pg2", "rt1-10", "rt2-10", "rt3-11", "ppu",
                "tkk_test_pref", "pg9", "pg10", "pg11", "tkk_user_pr", "jw", "wm", "ax", "poma", "jacek",
                "maciej", "prma", "jeto", "mitron", "vmx_access", "julo1", "rt1", "globalgui", "gl", "mm",
                "jo", "r1", "r2", "r3", "noma", "mpp", "ws", "waldest", "lg", "lg1", "milu-dis", "milu-exp",
                "ts", "drar", "grsy2", "prmag", "czma", "SoMa", "siwa", "ospr", "chto", "ms2", "grsy3",
                "sima", "ph", "szpi", "sima2", "milur", "koba", "bk", "tt", "df", "us", "siwat", "paka",
                "mikolaj", "kb", "ak", "road", "skpa", "dual", "mikolaj2", "mikolaj3", "leja", "road2",
                "juja", "jakr", "road1", "ph2", "tester01", "tester02", "tester03", "tester04", "tester05",
                "tester06", "puka", "ms3", "msacc", "bart", "bk_test", "qqqqqq", "paok", "ms99", "oper1",
                "glra", "bla", "bla2", "bla3", "luja", "msacc2", "111", "cwkr", "road3", "testowe2016",
                "testowe2015", "testowe2014", "puka2", "paoz", "bakoo", "nato", "magn", "PH3", "Bupi", "gada",
                "nato1", "bk2", "kb2", "maar", "jk", "QAFederation", "klda", "homa"]
     var user = userlist[Math.floor(Math.random() * userlist.length)]
     var buttons = [$fill, $fill2, $fill3]
     var button = buttons[Math.floor(Math.random() * buttons.length)];
     $username.val(user)
     button.click()
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