//--------------- POST EFFECT DEFINITION------------------------//
pc.extend(pc, function () {
    // Constructor - Creates an instance of our post effect
    var RefractionPostEffect = function (graphicsDevice, vs, fs, buffer) {
        var fragmentShader = "precision " + graphicsDevice.precision + " float;\n";
        fragmentShader = fragmentShader + fs;
        
        // this is the shader definition for our effect
        this.shader = new pc.Shader(graphicsDevice, {
            attributes: {
                aPosition: pc.SEMANTIC_POSITION
            },
            vshader: vs,
            fshader: fs
        });
        
        this.time = 0;
        this.buffer = buffer; 
    };

    // Our effect must derive from pc.PostEffect
    RefractionPostEffect = pc.inherits(RefractionPostEffect, pc.PostEffect);

    RefractionPostEffect.prototype = pc.extend(RefractionPostEffect.prototype, {
        // Every post effect must implement the render method which
        // sets any parameters that the shader might require and
        // also renders the effect on the screen
        render: function (inputTarget, outputTarget, rect) {
            var device = this.device;
            var scope = device.scope;

            // Set the input render target to the shader. This is the image rendered from our camera
            scope.resolve("uColorBuffer").setValue(inputTarget.colorBuffer);   
            scope.resolve("uMaskBuffer").setValue(this.buffer);   
            scope.resolve("uTime").setValue(this.time);
            this.time += 0.1;

            // Draw a full screen quad on the output target. In this case the output target is the screen.
            // Drawing a full screen quad will run the shader that we defined above
            pc.drawFullscreenQuad(device, outputTarget, this.vertexBuffer, this.shader, rect);
        }
    });

    return {
        RefractionPostEffect: RefractionPostEffect
    };
}());

//--------------- SCRIPT DEFINITION------------------------//
var Refraction = pc.createScript('refraction');

Refraction.attributes.add('vs', {
    type: 'asset',
    assetType: 'shader',
    title: 'Vertex Shader'
});

Refraction.attributes.add('fs', {
    type: 'asset',
    assetType: 'shader',
    title: 'Fragment Shader'
});

// initialize code called once per entity
Refraction.prototype.initialize = function() {
    var cameraMask = this.app.root.findByName('CameraMask');
    var maskBuffer = cameraMask.camera.renderTarget.colorBuffer;
    
    var effect = new pc.RefractionPostEffect(this.app.graphicsDevice, this.vs.resource, this.fs.resource, maskBuffer);

    // add the effect to the camera's postEffects queue
    var queue = this.entity.camera.postEffects;
    queue.addEffect(effect);
    
    this.effect = effect;
    
    // Save the current shaders for hot reload 
    this.savedVS = this.vs.resource;
    this.savedFS = this.fs.resource;
};

Refraction.prototype.update = function(){
     if(this.savedFS != this.fs.resource || this.savedVS != this.vs.resource){
         this.swap(this);
     }
};

Refraction.prototype.swap = function(old){
    this.entity.camera.postEffects.removeEffect(old.effect);
    this.initialize(); 
};