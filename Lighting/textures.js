function initTextures() {
    var image = new Image();  // Create the image object
    if (!image) {
      console.log('Failed to create the image object');
      return false;
    }
    var texture1 = gl.createTexture();   // Create a texture object
    if (!texture1) {
      console.log('Failed to create the texture1 object');
      return false;
    }
  
    image.onload = function(){ sendImageToTexture(image, 0, texture1); };
    image.src = 'imgs/skyTexture.jpeg';
  
    // Add more textures here
    var image2 = new Image();  // Create the image object
    if (!image2) {
      console.log('Failed to create the image object');
      return false;
    }
    var texture2 = gl.createTexture();   // Create a texture object
    if (!texture2) {
      console.log('Failed to create the texture2 object');
      return false;
    }
    image2.onload = function(){ sendImageToTexture(image2, 1, texture2); };
    image2.src = 'imgs/groundTexture.jpeg';
  
    return true;
  }
  
  
  function sendImageToTexture(img, n, texture){
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1); // Flip the image's y axis
    // Enable texture unit0
    switch(n){
      case 0:
        gl.activeTexture(gl.TEXTURE0);
        break;
      case 1:
        gl.activeTexture(gl.TEXTURE1);
        break;
      default:
        console.log("Error: Texture number not recognized");
    }
    // Bind the texture object to the target
    gl.bindTexture(gl.TEXTURE_2D, texture);
  
    // Set the texture parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  
    // Set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
  
    // Set the texture unit 0 to the sampler
    switch(n){
      case 0:
        gl.uniform1i(u_Sampler0, 0);
        break;
      case 1:
        gl.uniform1i(u_Sampler1, 1);
        break;
      default:
        console.log("Error: Texture number not found");
        break;
    }
  }
