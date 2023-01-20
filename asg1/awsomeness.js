function awesomeness(){
    for (var i = 0; i < g_shapesList.length; i++) {
        var shape = g_shapesList[i];
        var x = Math.random() * (Math.round(Math.random()) ? 1 : -1);
        var y = Math.random() * (Math.round(Math.random()) ? 1 : -1);
        shape.position = [x,y];
        shape.color = [Math.random(), Math.random(), Math.random(), 1.0];
    }
    for(var i = 0; i < 15; i++){
        var x = Math.random() * (Math.round(Math.random()) ? 1 : -1);
        var y = Math.random() * (Math.round(Math.random()) ? 1 : -1);
        var shape;
        if(Math.random() > 0.666){
            shape = new Circle();
            shape.segment = Math.round((Math.random() + 3) * 10)
        } else if(Math.random() < 0.333){
            shape = new Point()
        } else {
            shape = new Triangle()
        }
        shape.color = [Math.random(), Math.random(), Math.random(), 1.0];
        shape.position = [x,y];
        shape.size = Math.random() * 50;
        g_shapesList.push(shape);

    }
    renderAllShapes();
        
    }
