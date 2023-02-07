//user input
numines = null
username = null
function enter() {
    input = document.getElementById("button").value
    if (input > 0) {
        numines = input
    }
}
// timer code
starttime = null
finaltime = null
min = 00
sec = 00
hsec = 00
function updatetime() {
    time = Math.floor((finaltime - starttime) / 10)
    min = Math.floor(time / 6000)
    if (min < 10) {
        min = "0" + String(min)
    }
    else {
        min = String(min)
    }
    time = time % 6000
    sec = Math.floor(time / 100)
    if (sec < 10) {
        sec = "0" + String(sec)
    }
    else {
        sec = String(sec)
    }
    time = time % 100
    hsec = time
    if (hsec < 10) {
        hsec = "0" + String(hsec)
    }
    else {
        hsec = String(hsec)
    }
    
    document.getElementById("reset").innerHTML = "congratulations! you won with a time of " + min + ":" + sec + "." + hsec + "! click here to reset." 
}

// minesweeper code
winstatus = null
mines = { // object storing ids and number of surrounding mines
    cord: {

    }
}
nums = [] // all possible ids
mids = [] // ids of mines

function addcords() {
    for (let i = 11; i < 90; i++) {
        if (String(i)[0] != "9" && String(i)[0] != "0") {
            if (String(i)[1] != "9" && String(i)[1] != "0") {
                mines.cord[i] = {"ms" : 0}
                nums.push(i)
            }
        }
    }
}
function placemines() { // adds ms value "9" in object
    while (mids.length < numines) { // place 10 mines
        r = Math.floor(Math.random() * 64)
        if (mines.cord[nums[r]]["ms"] == 0) { //avoid repeat mines
            mines.cord[nums[r]]["ms"] = 9
            mids.push(nums[r])
        }
    }
}
function calcmines() { // updates all other ms values in object
    dvals = [-11, -10, -9, -1, 1, 9, 10, 11]
    for (let i = 0; i < mids.length; i++) { //each mine
        for (let j = 0; j < dvals.length; j++) { //each difference value
            try { //in case coordinate does not exist
                mines.cord[mids[i] + dvals[j]]["ms"] += 1
                if (mines.cord[mids[i] + dvals[j]]["ms"] > 9){
                    mines.cord[mids[i] + dvals[j]]["ms"] -= 1
                }
            }
            catch(err) {
            }
        }
    }
}
function play() { // button functions and class
    if (numines == null) {
        return
    }
    for (let i = 0; i < nums.length; i++) {
        cord = String(nums[i])
        bname = document.getElementById("b" + cord)
        bname.className = "map-blankbutton"
        if (mines.cord[nums[i]]["ms"] == 0) {
            bname.className = "map-zerobutton"
        }
        else if (mines.cord[nums[i]]["ms"] == 9) {
            bname.addEventListener("click", mine.bind(null, cord))
        }
        else {
            bname.addEventListener("click", number.bind(null, cord)) //null is for specific button, cord is parameter in "number" function
        }
    }
    document.getElementById("reset").innerHTML = "" 
    document.getElementById("reset").onclick = null
    inprogress = true
    starttime = Date.now()
}
function number(cord) { // reveal number
    if (winstatus != null) {
        return
    }
    bname = document.getElementById("b" + String(cord))
    bname.className = "map-numberbutton"
    bname.innerHTML = String(mines.cord[String(cord)]["ms"])
    checkwin()
}
function mine() { // game over
    if (winstatus == true) {
        return
    }
    inprogress = false
    winstatus = false
    for (let i = 0; i < nums.length; i++) {
        cord = String(nums[i])
        bname = document.getElementById("b" + cord)
        if (mines.cord[nums[i]]["ms"] == 0) {
            bname.className = "map-zerobutton"
        }
        else if (mines.cord[nums[i]]["ms"] == 9) {
            bname.className = "map-minebutton"
        }
        else {
            bname.className = "map-numberbutton"
            bname.innerHTML = String(mines.cord[String(cord)]["ms"])
        }
    }
    bname = document.getElementById("reset")
    bname.innerHTML = "you lost! click here to reset."
    bname.addEventListener("click", function () {
        window.location.reload()
    })
}
function checkwin() {
    if (winstatus == false) {
        return
    }
    for (let i = 0; i < nums.length; i++) {
        cord = String(nums[i])
        bname = document.getElementById("b" + cord)
        if (mines.cord[nums[i]]["ms"] > 0 && mines.cord[nums[i]]["ms"] < 9) {
            if (bname.className == "map-blankbutton") {
                return
            }
        }
    }
    winstatus = true
    win()
}
function win() {
    for (let i = 0; i < nums.length; i++) {
        cord = String(nums[i])
        bname = document.getElementById("b" + cord)
        if (mines.cord[nums[i]]["ms"] == 9) {
            bname.className = "map-minebutton"
        }
        else {
            bname.className = "map-blankbutton"
            bname.addEventListener("click", null)
            bname.innerHTML = "🌸"
        }
    }
    bname = document.getElementById("reset")
    bname.addEventListener("click", function () {
        window.location.reload()
    })
    finaltime = Date.now()
    updatetime()
}
function initialize() {
    addcords()
    placemines()
    calcmines()
    play()
     
}