kerk.animations = function(object,id,option){
    kerk.add(this);
    
    this.activeAnimate;
    this.anim = {};
    this.active = true;
    this.object = kerk.addObject(kerk.createNullObject(),'players');
    
    var anim = LoadObj.animations[id];
    
    if(anim){
        for(var i in anim){
            if(anim[i].sprite){
                this.anim[i] = new kerk.sprite(anim[i].sprite,option);
                this.anim[i].setVisible(false);
                this.object.addChild(this.anim[i].object);
            }
        }
        
        this.setAnimate('stend');
    }
    else console.warn('No find animation in data');
}
kerk.animations.prototype = {
    setAnimate: function(name){
        if(this.active && this.anim[name] && this.anim[name].exists){
            if(this.activeAnimate && this.activeAnimate !== name) this.anim[this.activeAnimate].setVisible(false);
            
            this.anim[name].setVisible(true);
            
            this.activeAnimate = name;
        }
    },
    setActive: function(a){
        this.active = a;
        this.object.visible = a;
        
        for(var i in this.anim) this.anim[i].setVisible(a);
    },
    update: function(){
        
    },
    destroy: function(){
        for(var i in this.anim) this.anim[i].destroy();
        
        kerk.removeObject(this.object)
        kerk.remove(this);
    }
}