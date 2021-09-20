var game_scene = new Phaser.Class({
    Extends: Phaser.Scene,
    initialize: function() {
        Phaser.Scene.call(this, { "key": "game_scene" });
    },
    init: function(data) {
        this.roomid = data.room;
    },     
    preload: preload, 
    create: create, 
    update: update
});
var player;
var platforms;
var cursors;
var gameOver = false;
var scoreText;

function preload() {
    this.load.scenePlugin({
        key: 'rexuiplugin',
        url: 'js/rexuiplugin.min.js',
        sceneKey: 'rexUI'
    });
    this.load.image('playground', 'assets/playground.png');
    this.load.image('black', 'assets/black.png');
    this.load.image('circle', 'assets/circle.png');
    this.load.image('circle-m', 'assets/circle-m.png');
    this.load.image('circlei', 'assets/circlei.png');
    this.load.image('circlei-m', 'assets/circlei-m.png');
    this.load.image('range-r', 'assets/range-r.png');
    this.load.image('range-dr', 'assets/range-dr.png');
    this.counter = 0;
}
walls=null;
function add_rect(scene,xm,ym,w,h) {
    walls.create(xm,ym,'black').setScale(w,h).refreshBody();
}
function build_wall(scene,x1,y1,x2,y2) {
    if(x1==x2&&y1==y2) return;
//    console.log('wall',x1,y1,x2,y2);
    if(x1==x2) {
        add_rect(scene,(x1+x2)/2, (y1+y2)/2, 20, y2-y1);
    }
    if(y1==y2) {
        add_rect(scene,(x1+x2)/2, (y1+y2)/2, x2-x1, 20);
    }
}
function build_room(scene,x1,x2,y1,y2,ud,dd,ld,rd) {
    var mx=(x1+x2)/2;
    var my=(y1+y2)/2;
    build_wall(scene,x1-10,y1,mx-ud/2,y1);
    build_wall(scene,mx+ud/2,y1,x2+10,y1);
    build_wall(scene,x1-10,y2,mx-dd/2,y2);
    build_wall(scene,mx+dd/2,y2,x2+10,y2);
    build_wall(scene,x1,y1-10,x1,my-ld/2);
    build_wall(scene,x1,my+ld/2,x1,y2+10);
    build_wall(scene,x2,y1-10,x2,my-rd/2);
    build_wall(scene,x2,my+rd/2,x2,y2+10);
}
tables=[];
function build_table(scene,x,y,r) {
    tables.push([x,y,r]);
    graphics.fillStyle(0xFCC99C, 1.0);
    graphics.fillCircle(x,y,r);
}
function build_tree(scene,x,y) {
    graphics.fillStyle(0x93E5AB, 1.0);
    graphics.fillCircle(x,y,30);
}
function build_rooms(scene) {
    var x1,y1;
    graphics.fillStyle(0xE7E1D9, 1.0);
    graphics.fillRect(-300,-300,600,600);
    build_room(scene,-300,300,-300,300,60,60,60,60);
    x1=-250; y1=950-360;
    build_room(scene,x1,x1+180,y1,y1+180,40,0,0,0);
    build_room(scene,x1+180,x1+180*2,y1,y1+180,40,0,0,0);
    build_room(scene,x1,x1+180,y1+180,y1+180*2,0,40,0,0);
    build_room(scene,x1+180,x1+180*2,y1+180,y1+180*2,0,40,0,0);
    x1=-600; y1=350;
    build_room(scene,x1,x1+200,y1,y1+200,0,0,40,0);
    build_wall(scene,x1+100,y1+100,x1+100,y1+200);
    build_table(scene,x1+50,y1+50,40);
    build_table(scene,x1+150,y1+150,40);
    x1=-950+80; y1=-850+20;
    build_room(scene,x1,x1+400,y1,y1+400,0,60,60,0);
    x1=400-80; y1=-950+70;
    build_room(scene,x1,x1+180,y1,y1+180,45,0,0,0);
    build_room(scene,x1+180,x1+180*2,y1,y1+180,45,0,0,0);
    build_room(scene,x1+180*2,x1+180*3,y1,y1+180,45,0,0,0);
    build_room(scene,x1,x1+180,y1+180,y1+180*2,0,45,0,0);
    build_room(scene,x1+180,x1+180*2,y1+180,y1+180*2,0,45,0,0);
    build_room(scene,x1+180*2,x1+180*3,y1+180,y1+180*2,0,45,0,0);
    x1=950-280-60; y1=950-280-40;
    build_room(scene,x1-200,x1,y1-200,y1,0,0,0,200);
    build_room(scene,x1+60,x1+200+60,y1-200,y1,0,200,0,0);
    build_room(scene,x1-200,x1,y1+60,y1+200+60,200,0,0,0);
    build_room(scene,x1+60,x1+200+60,y1+60,y1+200+60,0,0,200,0);
//    build_table(scene,x1-100,y1-100,60);
    build_table(scene,x1-100,y1+100+60,60);
    build_table(scene,x1+100+60,y1-100,60);
//    build_table(scene,x1+100+60,y1+100+60,60);
    build_tree(scene,-412,-605);
    build_tree(scene,-51,-452);
    build_tree(scene,151,-773);
    build_tree(scene,210,-557);
    build_tree(scene,-813,13);
    build_tree(scene,-600,-314);
    build_tree(scene,-544,234);
    build_tree(scene,-489,100);
    build_tree(scene,132,528);
    build_tree(scene,528,-239);
    build_tree(scene,-785,739);
    build_tree(scene,-255,-838);
    build_room(scene, -870, -770, -30, 70, 0, 0, 0, 0);
    build_table(scene,18,-700,40);
    build_table(scene,733,-310,60);
    scene.add.image(650,75,'playground');
}
function create() {
    infected=false;
    mask_status=false;
    lst_time = -1;
    voting = false;

    // temporary testing function for minigame
    var self = this;
    minigame = function () {
        self.scene.launch('unscramble');
    };

    this.scene.launch('bottom_banner',{room:this.roomid,pscene:this});

    this.input.keyboard.on('keydown-E', function () {get_do_pset(self);});
    this.input.keyboard.on('keydown-M', toggle_mask);
    this.input.keyboard.on('keydown-C', focus_chat);

    this.physics.world.setBounds(-1000, -1000, 2000, 2000); 
    graphics = this.add.graphics();
    graphics.lineStyle(20, 0x0000000);
    graphics.lineBetween(-1010, -1020, -1010, 1020);
    graphics.lineBetween(1010, -1020, 1010, 1020);
    graphics.lineBetween(-1020, -1010, 1020, -1010);
    graphics.lineBetween(-1020, 1010, 1020, 1010);
    platforms = this.physics.add.staticGroup();
    player = this.add.image(0, 0, 'circle');
    big_player = this.add.image(0, 0, 'circle');
    player.setScale(0.1);
    big_player.setScale(0.5);
    infect_range = this.add.image(0,0,'range');
    player_name=this.add.text(0,-30,playerName, { fontSize: '24px', fill: '#000',
    fontFamily: 'Montserrat',align:'center'}).setOrigin(0.5);
    container = this.add.container(0, 0, [player, infect_range, big_player, player_name]);
    container.setSize(20,20);
    this.physics.world.enable(container);

    container.body.setCollideWorldBounds(true);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(container, platforms);

    main_camera=this.cameras.cameras[0];
    main_camera.startFollow(container);
    main_camera.ignore(big_player);
//    main_camera.setZoom(1.5);
    
    minimap = this.cameras.add(10, 10, 100, 100).setZoom(100./2020);
    minimap.ignore(player_name);
    minimap.centerOn(0,0);
    minimap.ignore(infect_range);
    minimap.ignore(player);
    minimap.setBackgroundColor(0xFDF6E3);

    container.depth=10000;
    dayy=this.add.text(910,30,"day 1",
    { fontSize: '32px', fill: '#000',
    fontFamily: 'Inconsolata',
    backgroundColor: '#FFDE93'}).setOrigin(0.5,0).setScrollFactor(0);
    day2=this.add.text(910,60,"00:00",
    { fontSize: '32px', fill: '#000',
    fontFamily: 'Inconsolata',
    backgroundColor: '#FFDE93'}).setOrigin(0.5,0).setScrollFactor(0);
    //day_start_time
    info_text = this.add.text(500, 40, "",
    { fontSize: '32px', fill: '#000',
    fontFamily: 'Montserrat',align:'center',
    backgroundColor: '#EBD6D9'}).setOrigin(0.5).setScrollFactor(0);
    quest_text = this.add.text(10, 130,"A\nB\nC",
    { fontSize: '25px', fill: '#000',
    fontFamily: 'Inconsolata',
    backgroundColor: '#EBD6D9'}).setOrigin(0).setScrollFactor(0);
    info_text.depth=100000;
    dayy.depth=100001;
    day2.depth=100000;
    quest_text.depth=100000;
    minimap.ignore(quest_text);
    minimap.ignore(info_text);
    minimap.ignore(dayy);
    minimap.ignore(day2);

    other_players={};
    player_info={};
    console.log('hello');
    console.log(socket.id);
    
    tables=[];
    walls = this.physics.add.staticGroup();
    this.physics.add.collider(container, walls);
    build_rooms(this);

    var self=this;
    is_super=false;
    super_state=1;

    first_load=true;

    socket.on('update_info', function (info) {
        if(info.end_info) {
            self.scene.start("final_scene",{info:info});
            return;
        }
        id_name_map={};
        if(typeof super_count_txt!=='undefined')
            super_count_txt.text='Infected: '+info.tot_infects+'/'+info.infects_to_win;
        const zeroPad = (num, places) => String(num).padStart(places, '0');
//        console.log('upd info',info);
        dayy.text='day '+info.day;
        tim=Date.now()-info.day_start_time;
        tim=Math.floor(tim/(90*1000)*24*60);
        if(tim>24*60) tim=24*60;
        day2.text=zeroPad(Math.floor(tim/60),2)+':'+zeroPad(tim%60,2);
        player_info=info.player_info;
        has_buff = player_info[socket.id].buff;
        //player_info[id].pset
        is_super = player_info[socket.id].is_super;
        infected = player_info[socket.id].infected_state==3;
        pset_progress = player_info[socket.id].pset_progress;
        tot_psets = player_info[socket.id].tot_psets;
        if(pset_progress == 0) {
            var rgbtohex=function(r,g,b) {
                r=Math.round(r);
                g=Math.round(g);
                b=Math.round(b);
                if(r<0) r=0;
                if(g<0) g=0;
                if(b<0) b=0;
                if(r>255) r=255;
                if(g>255) g=255;
                if(b>255) b=255;
                return r*256*256+g*256+b;
            };
            var frac=Math.min(pset_progress,40)/40.;
            var c1=[254,190,93],c2=[177,208,118];
            poly[tot_psets + 1].fillColor = 0xFEBE5D;
        }
        if(tot_psets > 0)
            poly[tot_psets].fillColor = 0xB1D076;
        found_id={};
        cur_day = info.day;
        first_load = (cur_day != lst_time);
        lst_time = cur_day;
        Object.keys(player_info).forEach(function (id) {
            var pid=id;//player_info[id].playerId;
            id_name_map[id]=player_info[id].name;
            to_meet = player_info[socket.id].to_meet;
            quest_text.text = "Quest:";
            if(to_meet[0] != -1) {
                quest_text.text += "\n  Meet " + id_name_map[to_meet[0]];
                if(to_meet[1] >= 1)
                    quest_text.text += " (done)";
            }
            else
                quest_text.text += " None";
            if(has_buff)
                quest_text.text+='\nBuff: 2x effiency';

            if (pid === socket.id) {
                if(first_load) {
                    console.log('received initial pos');
                    console.log(player_info[id].x,player_info[id].y);
                    console.log(player_info[id].is_super);
                    container.body.reset(player_info[id].x+10,player_info[id].y+10);
                }
            }
            else {
                found_id[pid]=player_info[id];
                if(other_players[pid]!=undefined) {
                    if(player_info[id].mask_on)
                        other_players[pid]['pl'].setTexture('circle-m');
                    else
                        other_players[pid]['pl'].setTexture('circle');
                    other_players[pid]['ct'].body.reset(player_info[id].x+10,player_info[id].y+10);
                }
                else {
                    player1 = self.add.image(0, 0, 'circle');
                    player1.setScale(0.1);
                    text1=self.add.text(0,-30,id_name_map[id], { fontSize: '24px', fill: '#000',
                    fontFamily: 'Montserrat',align:'center'}).setOrigin(0.5);
                    minimap.ignore(player1);
                    minimap.ignore(text1);
                    container1 = self.add.container(0, 0, [player1, text1]);
                    container1.setSize(20,20);
                    self.physics.world.enable(container1);
                    other_players[pid]={'ct':container1,'pl':player1};
                }
            }});
        Object.keys(other_players).forEach(function (id) {
            if(found_id[id]==undefined) {
                other_players[id]['ct'].destroy();
                delete other_players[id];
            }
        });
        // console.log(prog);
        // open voting interface as we enter the voting phase
        if (info.phase == 1 && !voting) {
            voting = true;
            self.scene.launch('voting_room', {room: self.roomid, player_info: player_info});
        }
        // close voting interface
        if (info.phase == 0) {
            voting = false;
        }
    });

    this.input.keyboard.on(Phaser.Input.Keyboard.Events.ANY_KEY_DOWN, (event) => {
        if((!is_super)||ingame) return;
        switch(event.code) {
            case 'Digit1':
            case 'Numpad1':
                super_state=1;
            break;
            case 'Digit2':
            case 'Numpad2':
                super_state=2;
            break;
            case 'Digit3':
            case 'Numpad3':
                super_state=3;
            break;
        }
    });

}


function toggle_mask(event) {
    if (ingame) return ;
    if(voting) return;
    console.log('M');
    mask_status=!mask_status;
}


function focus_chat(event) {
    if (ingame) return ;
    if(voting) return;
    console.log('C');
    if(thechatBox!=null) {
        thechatBox.setFocus();
    }
}
var lastUpdate=Date.now();
ingame = 0;
var id_lounge = 10000;
function get_do_pset(scene) {
    if (ingame) return ;
    if(voting) return;
    if (id_lounge > 1000) return ;
    if (id_lounge == 0) { // get a new pset
        ingame++;
        console.log("get pset");
        scene.scene.launch(unscramble_scene, {pset_type: 0, pscene: scene});
    }
    else {
        ingame++;
        console.log("do pset");
        scene.scene.launch(calcgame_scene, {pset_type: 1, pscene: scene});
    }
}
function update () { // ok now
    if(ingame<0) ingame=0;
    var take_pset = 0, do_pset = 0;
    var nx = container.body.x+10, ny = container.body.y+10;
    id_lounge = 10000;
    if (nx >= -300 && nx <= 300 && ny >= -300 && ny <= 300)
        take_pset = 1, id_lounge = 0;
    var tbcnt = 0;
    for(var u of tables) {
        tbcnt += 1;
        if((nx-u[0])*(nx-u[0])+(ny-u[1])*(ny-u[1])<=u[2]*u[2]) {
            do_pset=1;
            id_lounge = tbcnt;
        }
    }
    socket.emit('join_group', id_lounge);
    if(!ingame) {
        info_text.text="";
        if (take_pset) {
            info_text.text="Press E to get a new pset";
        }
        if (do_pset) {
            info_text.text="Press E to join pset group";
            if(pset_progress==-1) {
                info_text.text+="\n(pick a pset to actually progress)";
            }
        }
    }
    else if(do_pset&&pset_progress!=-1) {
        info_text.text="pset progress: "+pset_progress+"/"+40;
    }
    else info_text.text="";

    if (infected) {
        if (mask_status) {
            player.setTexture('circlei-m');
            infect_range.setTexture('range-r');
        }
        else {
            player.setTexture('circlei');
            infect_range.setTexture('range-dr');
        }
        main_camera.rotation += 0.01*(Math.random()-.5);
        main_camera.rotation=Math.min(Math.max(main_camera.rotation,-0.1),0.1);
    }
    else {
        if (mask_status) {
            player.setTexture('circle-m');
            infect_range.setTexture('range-r');
        }
        else {
            player.setTexture('circle');
            infect_range.setTexture('range-dr');
        }
        main_camera.rotation=0;
    }


    //lec_att; 

    var speed = 320;
    if (cursors.shift.isDown&&!mask_status) speed *= 3;
    var vx = 0, vy = 0;
    if (cursors.left.isDown) vx -= speed;
    if (cursors.right.isDown) vx += speed;
    if (cursors.up.isDown) vy -= speed;
    if (cursors.down.isDown) vy += speed;
    if(ingame||voting) {
        vx=0, vy=0;
    }
    if(vx&&vy) {
        vx/=Math.sqrt(2);
        vy/=Math.sqrt(2);
    }
    var dx=0,dy=0;
    if(vx) {
        if(infected) dy+=(Math.random()-.5)*vx;
    }
    if(vy) {
        if(infected) dx-=(Math.random()-.5)*vy;
    }
    vx+=dx; vy+=dy;
    container.body.setVelocityX(vx);
    container.body.setVelocityY(vy);
    var curTime = Date.now();
    if (curTime-lastUpdate>30) // && !first_load)
        lastUpdate=curTime, 
        socket.emit('update', {x:container.body.x, y:container.body.y,
            mask_on: mask_status, infected_state: super_state, day: lst_time});
}

