// import Vector3 from './cuon-matrix-cse160';

function handleDrawEvent() {
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var ctx = canvas.getContext('2d');

    // clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);

    // get input values
    var x1 = document.getElementById("x1").value;
    var y1 = document.getElementById("y1").value;
    var x2 = document.getElementById("x2").value;
    var y2 = document.getElementById("y2").value;

    var v1 = new Vector3([x1, y1, 0]);
    var v2 = new Vector3([x2, y2, 0]);

    drawVector(v1, "red");
    drawVector(v2, "blue");
}

function handleDrawOperationEvent(){
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    var ctx = canvas.getContext('2d');

    // clear canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, 400, 400);

    // get input values
    var x1 = document.getElementById("x1").value;
    var y1 = document.getElementById("y1").value;
    var x2 = document.getElementById("x2").value;
    var y2 = document.getElementById("y2").value;

    var v1 = new Vector3([x1, y1, 0]);
    var v2 = new Vector3([x2, y2, 0]);

    var operation = document.getElementById("operation").value;
    var scalar = document.getElementById("scalar").value;

    if(operation == "anglebetween"){
        var angle = angleBetween(v1, v2);
        drawVector(v1, "red");
        drawVector(v2, "blue");
        console.log("Angle: ", angle);
        return;
    } else if(operation == "area"){
        var area = areaTriangle(v1, v2);
        drawVector(v1, "red");
        drawVector(v2, "blue");
        console.log("Area of the triangle: ", area);
        return;
    }else if(operation == "add"){
        var v3 = v1.add(v2);
    } else if(operation == "subtract"){
        var v3 = v1.sub(v2);
    } else if(operation == "multiply"){
        var v3 = v1.mul(scalar);
        var v4 = v2.mul(scalar);
    } else if(operation == "divide"){
        var v3 = v1.div(scalar);
        var v4 = v2.div(scalar);
    } else if (operation == "magnitude"){
        console.log("Magnitude v1: ", v1.magnitude());
        console.log("Magnitude v2: ", v2.magnitude());
    } else if (operation == "normalize"){
        var v3 = v1.normalize();
        var v4 = v2.normalize();
    } 

    v1 = new Vector3([x1, y1, 0]);

    
    if(operation == "normalize"){
        drawVector(v3, "green");
        drawVector(v4, "green");
    } else if(operation == "add" || operation == "subtract"){
        drawVector(v1, "red");
        drawVector(v2, "blue");
        drawVector(v3, "green");
    } else if(operation == "multiply" || operation == "divide"){
        drawVector(v1, "red");
        drawVector(v2, "blue");
        drawVector(v4, "green");
    }
}

function angleBetween(v1, v2){
    var dotProduct = Vector3.dot(v1,v2)
    var magnitude = v1.magnitude() * v2.magnitude();
    var angle = Math.acos(dotProduct / magnitude) * 180 / Math.PI;
    return angle;
}

function areaTriangle(v1, v2){
    var crossProduct = Vector3.cross(v1,v2);
    var area = crossProduct.magnitude() / 2;
    return area;
}

// DrawRectangle.js
function main() {
    // Retrieve <canvas> element <- (1)
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // Get the rendering context for 2DCG <- (2)
    var ctx = canvas.getContext('2d');

    // Draw a blue rectangle <- (3)
    // ctx.fillStyle = 'rgba(0, 0, 0, 1.0)'; // Set a blue color
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, 400, 400); // Fill a rectangle with the color

    var v1 = new Vector3([0, 0, 0]);

    drawVector(v1, "red");
}

function drawVector(v, color){
    var canvas = document.getElementById('example');
    if (!canvas) {
        console.log('Failed to retrieve the <canvas> element');
        return;
    }

    // get x and y coordinates from v
    var x = v.elements[0] * 20; 
    var y = v.elements[1] * 20;

    var ctx = canvas.getContext('2d');
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(200, 200);
    ctx.lineTo(200 + x, 200 - y);
    ctx.stroke();
}
