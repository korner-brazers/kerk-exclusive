var mpl = new function() {
    this.data = {},this.impt = {},this.serv = {},this.comp = [],this.time = {},this.c_time,this.timer,this.scor;
    
    this.start = function(){
        clearTimeout(mpl.timer);
        
        mpl.timer = setInterval(function(){
            if(kerk.inGame){
                mp.emit('playerPosition',{
                    point: kerk.allElem.objs[unitid].point,
                    visPoint: kerk.cor()
                })
            }
        },1000/200);
    }
    
    this.stop = function(){
        clearTimeout(mpl.timer);
    }
    
    this.connect = function(){
        console.log('ole')
    }
    
    this.destroy = function(){
    }
    
    this.add = function(m,a){
        mp.impt[m] = a;
    }
    this.addServ = function(m,a){
        mp.serv[m] = a;
    }
    
    this.status = function(a){
        !mp.impt.s && (mp.impt.s = []);
         mp.impt.s.push(a);
    }
    
    this.collector = function(){
        var my = kerk.allElem.objs[unitid];
        
        if(my){
            mp.impt.u = {};
            
            if(my.vehicle){
                var ve = kerk.allElem.objs[my.vehicle];
                
                mp.impt.iv = [my.vehicle,ve.drivers.indexOf(unitid)];
                
                if(ve.drivers[0] == unitid){
                    mp.impt.u.p = ve.position;
                    mp.impt.u.pt = ve.point;
                    mp.impt.u.a = ve.angle;
                    
                    ve.ob_ty && (mp.impt.u.ty = ve.ty.angle);
                }
            }
            else{
                mp.impt.u.p = my.position;
                mp.impt.u.pt = my.point;
                mp.impt.u.a = my.angle;
            }
        }
        
        var data = {d: JSON.stringify(mp.impt),s: JSON.stringify(mp.serv),p: unitid,mi:menu.serverInfo.id};
        
        mp.impt = {};
        mp.serv = {};
        
        return data;
    }
    
    this.JResult = function(j){
        for(var i in j.players){
            if(i == unitid) continue;
            
            mp.checkOf(i,j.players[i]);
        }
        
        mp.serverHandler(j.server);
        mp.checkOnline(j.server.time);
    }
    
    this.checkOf = function(id,j){
        !mp.data[id] && (mp.data[id] = []);
        !mp.time[id] && (mp.time[id] = j.t);
        
        for(var i = j.d.length;i--;){
            
            var ix = mp.data[id].indexOf(j.d[i].t);
            
            if(ix >= 0) continue;
            
            mp.data[id].push(j.d[i].t);
            
            mp.handler(id,j.d[i]);
            
            if(mp.data[id].length > 50) mp.data[id] = mp.data[id].slice(-50);
        }
        
        mp.time[id] = j.t;
    }
    
    this.serverHandler = function(j){
        if(j.tiket) ifs.tiket(j.tiket);
        
        if(menu.serverInfo.mode > 2){
            if(j.mark){
                for(var m in j.mark){
                    var ob = kerk.allElem.icons[m];
                    
                    if(ob){
                        kerk.allData.almrk[m].team = j.mark[m];
                        
                        if(j.mark[m] == dataCache.team) ob.setImage(kerk.allData.def.mark_ce.ob);
                        else ob.setImage(kerk.allData.def.mark_vg.ob);
                    }
                }
            }
        }
    }
    
    this.handler = function(id,cmd){
        if(!cmd.u) return;
        
        cmd.ur && kerk.resetUnit({id:cmd.ur},1);
        
        if(!kerk.allElem.objs[id]) kerk.createUnit({
            position: cmd.u.p,
            point: cmd.u.p,
            id: id,
            name: 'lol',
        });
        
        if(cmd.k){
            if(cmd.k.i == unitid && kerk.allElem.objs[unitid].status !== 'die'){
                mp.add('e',{i:cmd.k.h,h:kerk.allElem.objs[unitid].hl});
                kerk.killUnit(unitid);
                mp.add('ck',unitid);
            }
            
            ifs.kill(kerk.allElem.objs[cmd.k.h].name,kerk.allElem.objs[cmd.k.i].name,'jhj');
        }
        
        cmd.e && cmd.e.i == unitid && ifs.enemy(cmd.e.h);
        cmd.ck && kerk.killUnit(cmd.ck);
        
        var ob = kerk.allElem.objs[id];
        
        if(!cmd.iv && ob.status !== 'die'){
            ob.ob.setAttrs({
                x: ob.position[0],
                y: ob.position[1],
                rotation: ob.angle
            })
            
            ob.traon = cmd.u.p;
            ob.point = cmd.u.pt;
            ob.angle = cmd.u.a;
        }
        
        cmd.cs && kerk.Shot({
            id: id,
            bu: cmd.cs.b,
            from: cmd.cs.f,
            point: cmd.cs.p,
            type: cmd.cs.t,
            status: 1
        });
        
        cmd.ss && kerk.stopShot(id);
        
        if(cmd.s){
            for(var s = cmd.s.length;s--;){
                kerk.allElem.objs[cmd.s[s].i].status = cmd.s[s].s;
                kerk.setSprite(cmd.s[s].i,cmd.s[s].s);
            } 
        }
        
        
        
        if(cmd.l){
            kerk.allElem.objs[cmd.l.i].hl -= cmd.l.m;
            
            if(cmd.l.i == unitid) ifs.life(kerk.allElem.objs[unitid].hl,LoadMap.obj.players[kerk.allElem.objs[unitid].player_id].hl);
        }
        
        cmd.vd && kerk.destroyVehicle(cmd.vd);
        
        if(cmd.iv){
            var ve = kerk.allElem.objs[cmd.iv[0]];
            
            if(ve.status !== 'die'){
                ob.vehicle = cmd.iv[0];
                
                ve.drivers[cmd.iv[1]] = id;
                
                ve.traon = cmd.u.p;
                ve.point = cmd.u.pt;
                ve.angle = kerk.corAngle(ve.angle,cmd.u.a);
                
                if(ve.ob_ty) ve.ty.angle = kerk.corAngle(ve.ty.angle,cmd.u.ty);
            }
            
        }
        else ob.vehicle = 0;
    }
    
    this.corObj = function(i){
        var ob = kerk.allElem.objs[i];
            
        if(ob.ob_ty){
            if(ob.drivers[0] !== unitid){
                ob.ob_ty && ob.ob_ty.transitionTo({
                    rotation: ob.ty.angle,
                    duration: 0.2,
                    easing: 'linear'
                });
            }
        }
        
        if(ob.traon){
            ob.ob.transitionTo({
                rotation: ob.angle,
                x: ob.traon[0],
                y: ob.traon[1],
                duration: 0.2,
                easing: 'linear',
                callback: function(){
                    ob.position[0] = ob.traon[0];
                    ob.position[1] = ob.traon[1];
                    ob.traon = 0;
                }
            });
        }
    }
    
    this.corect = function(){
        for(var i in kerk.allElem.objs) mp.corObj(i);
    }
    
    this.checkOnline = function(time){
        for(var i in mp.data){
            if(time - mp.time[i] > 15){
                kerk.removeUnit(i); delete mp.data[i];
            } 
        }
    }
}