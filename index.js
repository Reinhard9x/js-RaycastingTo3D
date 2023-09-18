const canvas = document.getElementById('mycanvas')
const ctx = canvas.getContext('2d')
let wall = []
let wallnum = 5
let cnvmeasures = 500
document.getElementById('mycanvas').width = cnvmeasures
document.getElementById('mycanvas').height = cnvmeasures
//ball releted stuff
let ballcoords = [canvas.height/2,canvas.width/2]
let ballradius = 10
let num = 0
//ray related
let viscone = Math.PI*2
let radius = cnvmeasures*3
let angle = 0
let raynum = 500
let angchange = viscone/raynum
let intersect = []
let arr = []
let pos = []
let x = 0
let y = 0
let u = 0
let t = 0
//ralated to fov and rendering 
let planedist = 0
let fovmovement = 0
let min = 0
let distances = []
let columnwidth = 1
let start = [cnvmeasures,cnvmeasures]
let end = [cnvmeasures,0]
let angles = []
let positions = []
//create walls
function walls(){
    for(let i = 0; i < wallnum ; ++i){
        ctx.beginPath()
        ctx.globalAlpha = 1
        x = Math.floor(Math.random()*500)
        y = Math.floor(Math.random()*500)
        wall.push([x,y])
        ctx.beginPath()
        ctx.moveTo(x,y)
        x = Math.floor(Math.random()*500)
        y = Math.floor(Math.random()*500)
        wall.push([x,y])
        ctx.lineTo(x,y)
        ctx.strokeStyle = 'red'
        ctx.stroke()
    }
}
walls()
//mantain same walls
function maintain(){
    for(let i = 0; i < wall.length; i += 2){
        ctx.beginPath()
        ctx.globalAlpha = 1
        ctx.moveTo(wall[i][0],wall[i][1])
        ctx.lineTo(wall[i+1][0],wall[i+1][1])
        ctx.strokeStyle = 'red'
        ctx.stroke()
    }
}
//create ball
function ball(){
ctx.beginPath()
ctx.fillStyle = 'white'
ctx.arc(ballcoords[0],ballcoords[1],ballradius,0,Math.PI*2)
ctx.fill()
}
ball()
//create rays
function rays(){
    for(let i = 0; i < raynum; ++i){
        ctx.beginPath()
        ctx.globalAlpha = 0.3
        ctx.strokeStyle = 'white'
        ctx.moveTo(ballcoords[0],ballcoords[1])
        for(let i = 0; i < wall.length ; i += 2){
            arr = [wall[i], wall[i+1]]
            raycollision()
        }
        //collision with canvas walls
       arr = [[0,0],[cnvmeasures,0]]
        raycollision()
        arr = [[cnvmeasures,0],[cnvmeasures,cnvmeasures]]
        raycollision()
        arr = [[cnvmeasures,cnvmeasures],[0,cnvmeasures]]
        raycollision()
        arr = [[0,cnvmeasures],[0,0]]
        raycollision()
        if(pos.length == 0){
            pos = [ballcoords[0] + radius*Math.cos(angle), ballcoords[1] + radius*Math.sin(angle)]
        }
        angles.push(angle)
        distances.push(min)
        positions.push(pos)
        ctx.lineTo(pos[0],pos[1])
        ctx.stroke()
        intersect = []
        pos = []
        angle += angchange
    }
    //center the field of view on the right at the start by moving the angle in which the rays start to be drawn
    angle = -viscone/2 + fovmovement
}
rays()
//ray collision
function raycollision(){
    let x1 = ballcoords[0] 
    let y1 = ballcoords[1]
    let x2 = ballcoords[0] + radius*Math.cos(angle)
    let y2 = ballcoords[1] + radius*Math.sin(angle)
    let x3 = arr[0][0]
    let y3 = arr[0][1]
    let x4 = arr[1][0]
    let y4 = arr[1][1]
    //make sure there is an intersection
    if(((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)) != 0){
        t = ((x1-x3)*(y3-y4) - (y1-y3)*(x3-x4)) / ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4))
        u = ((x1-x3)*(y1-y2) - (y1-y3)*(x1-x2)) / ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4))
    }
    //find the intersection point
    if(t >= 0 && t <= 1 && u >= 0 && u <= 1 && ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4)) != 0){
        x = ((x1*y2-y1*x2)*(x3-x4) - (x1-x2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4))
        y = ((x1*y2-y1*x2)*(y3-y4) - (y1-y2)*(x3*y4-y3*x4)) / ((x1-x2)*(y3-y4) - (y1-y2)*(x3-x4))
        intersect.push([x, y])
    }
    //make the ray stop at the closest line if it intersects many
    min = cnvmeasures
    if(intersect.length > 0){
        pos = []
        for(let i = 0; i < intersect.length; i++){
            let dist = Math.sqrt(Math.pow(intersect[i][0]-ballcoords[0],2)+Math.pow(intersect[i][1]-ballcoords[1],2))
            if(dist < min){
                min = dist
                pos = intersect[i]     
            }
        }
    }
}
//ball collision
function collision(){
    if(ballcoords[0]-ballradius <= 0 || ballcoords[0]+ballradius >= canvas.height){
        return true
    }
    if(ballcoords[1]-ballradius <= 0 || ballcoords[1]+ballradius >= canvas.width){
        return true
    }
    return false
}
//mouse movement of the ball 
/*
window.addEventListener('mousemove',movement)
function movement(event){
    ballcoords[0] = event.clientX
    ballcoords[1] = event.clientY 
    if(num == 0){
        ctx.clearRect(0,0,canvas.width,canvas.height)
        maintain()
        ball()
        rays()
    }
    //ball stays put until the coords are valid again
    if(collision() == false){
        num = 0
    }
    else{
        num = 1
    }
}
*/
//move ball with wasd
//moving animation
function moveani(){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    maintain()
    ball()
    rays()
    ctx3d.clearRect(0,0,canvas.width,canvas.height)
    render()
    distances = []
    positions = []
    angles = []
    
}
//movement
window.addEventListener('keydown',movement)
function movement(event){
    //if(num == 0){
        switch(event.key){
            case 'w':
                if(ballcoords[1] - ballradius -1 >= 0){
                    ballcoords[1] -= 10
                    moveani()
                }
                break
            case 's':
                if(ballcoords[1] + ballradius + 1 <= 500){
                    ballcoords[1] += 10
                    moveani()
                }
                break
            case 'a':
                if(ballcoords[0] - ballradius - 1 >= 0){
                    ballcoords[0] -= 10
                    moveani()
                }
                break
            case 'd':
                if(ballcoords[0] + ballradius + 1 <= 500){
                    ballcoords[0] += 10
                    moveani()
                }
                break
        }
        
    //}
    //ball stays put until the coords are valid again

    /*if(collision() == false){
        num = 0
    }
    else{
        num = 1
    }*/
}
// fov movement
window.addEventListener('keydown',movefov)
function movefov(event){
    switch(event.key){
        case 'ArrowLeft':
            fovmovement -= 0.05
            moveani()
            break
        case 'ArrowRight':
            fovmovement += 0.05
            moveani()
            break
    }  
}
//reset lines
document.querySelector('#mybutton').onclick = function (){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    wall = []
    walls()
    ball()
    rays()
    ctx3d.clearRect(0,0,canvas.width,canvas.height)
    render()
    distances = []
    positions = []
    angles = []

}
//apply angle
document.querySelector('#appangle').onclick = function (){
    viscone = document.getElementById('angle').value / 360 * Math.PI*2
    angchange = viscone/raynum
    moveani()
}
//number of rays
document.querySelector('#appraynum').onclick = function (){
    raynum = document.getElementById('raynum').value
    angchange = viscone/raynum
    moveani()
}
//create 3dcanvas
const canvas3d = document.getElementById('mycanvas3d')
const ctx3d = canvas3d.getContext('2d')
document.getElementById('mycanvas3d').width = cnvmeasures
document.getElementById('mycanvas3d').height = cnvmeasures
//draw the lines
function render(){
for(let i = 0; i < distances.length; i++){
    let anglediff = (angles[angles.length/2] - angles[i])
    let correctdist = (distances[i])*(Math.cos(anglediff))
    let col = 255 - correctdist/2
    let n = cnvmeasures/raynum
    let colheight = 1/correctdist * 500
    start[1] = (cnvmeasures/2 + colheight*10) 
    end[1] = (cnvmeasures/2 - colheight*10) 
    //the width of each column
    columnwidth = cnvmeasures/raynum
    for(let j = 0; j < columnwidth; j++){
        ctx3d.beginPath()
        ctx3d.strokeStyle = 'rgb('+col+','+col+','+col+')'
        ctx3d.moveTo(start[0],start[1])
        ctx3d.lineTo(end[0],end[1])
        ctx3d.stroke()
        start[0] += 1
        end[0] += 1
    }
}
start = [0,cnvmeasures]
end = [0,0]
}
render()
