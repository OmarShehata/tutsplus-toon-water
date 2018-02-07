var CameraMask = pc.createScript('cameraMask');

// initialize code called once per entity
CameraMask.prototype.initialize = function() {
    // Create a 512x512x24-bit render target with a depth buffer
    var colorBuffer = new pc.Texture(this.app.graphicsDevice, {
        width: 512,
        height: 512,
        format: pc.PIXELFORMAT_R8_G8_B8,
        autoMipmap: true
    });
    colorBuffer.minFilter = pc.FILTER_LINEAR;
    colorBuffer.magFilter = pc.FILTER_LINEAR;
    var renderTarget = new pc.RenderTarget(this.app.graphicsDevice, colorBuffer, {
        depth: true
    });

    this.entity.camera.renderTarget = renderTarget;

    this.CameraToFollow = this.app.root.findByName('Camera');
    
    // Set all bits except for 2 
    this.entity.camera.camera.cullingMask &= ~(1 << 2) >>> 0;
    // Set all bits except for 3
    this.CameraToFollow.camera.camera.cullingMask &= ~(1 << 3) >>> 0;
    // If you want to print out this bit mask, try:
    // console.log((this.CameraToFollow.camera.camera.cullingMask >>> 0).toString(2));
};

// update code called every frame
CameraMask.prototype.update = function(dt) {
    var pos = this.CameraToFollow.getPosition();
    var rot = this.CameraToFollow.getRotation();
    this.entity.setPosition(pos.x,pos.y,pos.z);
    this.entity.setRotation(rot);
};

// swap method called for script hot-reloading
// inherit your script state here
// CameraMask.prototype.swap = function(old) { };

// to learn more about script anatomy, please read:
// http://developer.playcanvas.com/en/user-manual/scripting/