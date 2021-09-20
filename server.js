//server of the game. node.js
const { DH_UNABLE_TO_CHECK_GENERATOR } = require('constants');
var express=require('express');
const { get } = require('http');
var app=express();
var server=require('http').Server(app);
var io=require('socket.io')(server);
app.use(express.static(__dirname+'/public'));
app.get('/',function(req,res) {
    res.sendFile(__dirname+'/index.html');
});
var port=233;
server.listen(port,function() {
    console.log('server started at '+port);
});
//the room each user is connecting
var nick={};
var is_ready={};
var room_id={};
var room_member={};
var room_state={};
var room_watchers={};
var votes_info={};
var player_info = {};

var grad_to_win = 5;
var room_day = {};
var room_infects = {};
var psets_to_grad = 5;
var infects_to_win = 6;
var pset_size = 40;
/*

    return value of update_info: 
    {
        {player_info: cur_info, #map id to the information of each person
            end_info: room_res[room], #whether the game is end or not; -1 if super wins; 0 if continuing; 1 if most win
            day: room_day[room], #current day (from 1 to 7)
            phase: room_phase[room], // 0: normal day, 1: vote 2: display the result of vote
            day_start_time: phase_time[room] // the start time of current phase
            tot_infects: // current infects
            infects_to_win: // infect number to win
            votes_info : //{correct: wrong: skip: }
        };//  
    }
    player_id: {
        x: the x of player
        y: the y of player
        groupid: id of pset group
        mask_on: 0 if mask is not on, 1 if on
        tot_psets: total number of psets done; == 5 then graduate
        pset_progress: progress of current pset; -1 if not released
        infected_state: 0 if not infected, 
                        1 if infected but cannot infect others, 
                        2 if infected, can infect others, but no symptoms
                        3 if have symptoms
        state_end_time : will be so until 
        is_super : // 1 if super spreader
        vote: vote the player with id
        name: the name of player
        get_votes: // number of votes got 
        to_meet: // [id, complete or not]
        buff : // whether is buffed today
        is_sep: // whether is separated
    }
    client calls server: 
        'start_game', room // start the game in room
        'shut_game', room //shut the game in room
        'update', state //update the player's state (in the form of 
            {x:, y:, mask_on:, ...
            })
        'vote', vid // votes vid
        'get_pset' // get a new pset (if none exists before)
        'join_group', groupid // join the pset group with id groupid; 
                              // must do so before doing pset
        'pset_progress' // solved a problem in pset
    server calls client:
        'update_info', player_info // player_info contains the info of players in the room
*/
var max_day = 6;
var lst_range = [[10000, 10001], [5, 15], [15, 25], [25, 35]];
var room_res = {};
var room_phase = {};
var phase_time = {};
var ptime = [90000, 60000, 5000];
//var ptime = [1000, 10000, 1000];
//var ptime = [3000, 10000, 10000];
var tot_walls = [];


function get_info_of_room(room) {
    if(!room_member[room]) return {};
    try {
    cur_info = {};
    for (ids of room_member[room]) 
        cur_info[ids] = player_info[ids];
    return {player_info: cur_info, 
            end_info: room_res[room], 
            day: room_day[room], 
            phase: room_phase[room], // 0: normal day, 1: vote
            day_start_time: phase_time[room], 
            tot_infects: room_infects[room], 
            infects_to_win: infects_to_win, 
            votes_info: votes_info[room]
        }; 
    }catch(e){console.log(e);}
    // end_type : 1 if most win, -1 if super wins, 0 if continuing
}
function build_wall(scene,x1,y1,x2,y2) {
    try {
    tot_walls.push([x1, y1, x2, y2]);
    }catch(e){console.log(e);}
}
function build_room(scene,x1,x2,y1,y2,ud,dd,ld,rd) {
    try{
    var mx=(x1+x2)/2;
    var my=(y1+y2)/2;
    build_wall(scene,x1-10,y1,mx-ud/2,y1);
    build_wall(scene,mx+ud/2,y1,x2+10,y1);
    build_wall(scene,x1-10,y2,mx-dd/2,y2);
    build_wall(scene,mx+dd/2,y2,x2+10,y2);
    build_wall(scene,x1,y1-10,x1,my-ld/2);
    build_wall(scene,x1,my+ld/2,x1,y2+10);
    build_wall(scene,x2,y1-10,x2,my-rd/2);
    build_wall(scene,x2,my+rd/2,x2,y2+10);}catch(e){console.log(e);}
}
function build_rooms(scene) {
    try{
    var x1,y1;
    build_room(scene,-300,300,-300,300,60,60,60,60);
    x1=-250; y1=950-360;
    build_room(scene,x1,x1+180,y1,y1+180,40,0,0,0);
    build_room(scene,x1+180,x1+180*2,y1,y1+180,40,0,0,0);
    build_room(scene,x1,x1+180,y1+180,y1+180*2,0,40,0,0);
    build_room(scene,x1+180,x1+180*2,y1+180,y1+180*2,0,40,0,0);
    x1=-600; y1=350;
    build_room(scene,x1,x1+200,y1,y1+200,0,0,40,0);
    build_wall(scene,x1+100,y1+100,x1+100,y1+200);
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
    build_room(scene, -870, -770, -30, 70, 0, 0, 0, 0);}catch(e){console.log(e);}
}

build_rooms(1);
function dif(a, b) {
    try{
    return [a[0] - b[0], a[1] - b[1]];
    }catch(e){console.log(e);}
}
function smt(a, b) {
    try{
    res = a[0] * b[1] - a[1] * b[0];
    if (res > 0) return 1;
    if (res == 0) return 0;
    return -1;
    }catch(e){console.log(e);}
}
function chk(a, b, c, d) {
    try{
    //check if (a, b) and (c, d) intersects
    if (smt(dif(c, a), dif(b, a)) == smt(dif(d, a), dif(b, a))) return 0;
    if (smt(dif(a, c), dif(d, c)) == smt(dif(b, c), dif(d, c))) return 0;
    return 1;
    }catch(e){console.log(e);}
}
function chk_seg(a, b) {
    try{
    for (x of tot_walls) {
        cd = [x[0], x[1]];
        cc = [x[2], x[3]];
        if (chk(a, b, cc, cd)) return 0;
    }
    return 1;
    }catch(e){console.log(e);}
}
function newvote(room) {
    try{
    room_phase[room] = 1;
    }catch(e){console.log(e);}
}
function ran_pl(ids) {
    if(!player_info[ids]) return;
    try{
    while (1) {
        player_info[ids].x = gen_rand([-300, 300]);
        player_info[ids].y = gen_rand([-300, 300]);
        
        if (player_info[ids].x ** 2 + player_info[ids].y ** 2 > 200 ** 2)
            continue;
        break;
    }}catch(e){console.log(e);}
}
function newdisplay(room) {
    if(!room_member[room]) return;
    try{
    room_phase[room] = 2;
    var max_id = -1
    var max_num = 0;
    for (voters of room_member[room]) if(player_info[voters])
        if (player_info[voters].vote == '')
            max_num++;
    for (ids of room_member[room]) if(player_info[ids])
        if (player_info[ids].is_sep)
            ran_pl(ids),
            player_info[ids].is_sep = 0;

    for (ids of room_member[room]) {
        var cnt = 0;
        for (voters of room_member[room]) if(player_info[voters])
            if (player_info[voters].vote == ids)
                cnt += 1;
        if (cnt > max_num) {
            max_id = ids;
            max_num = cnt;
        }
        else if (cnt == max_num) 
            max_id = -1;
//        console.log("ids: " + ids + "has " + cnt + " votes");
        player_info[ids].get_votes = cnt;
    }  
    if (max_id==-1) votes_info[room].skip += 1;
    else if (player_info[max_id].is_super) votes_info[room].correct += 1;
    else votes_info[room].wrong += 1;

    for (ids of room_member[room]) if(player_info[ids]) {
        player_info[ids].vote = 0; // not yet; -1 skip
        if (ids == max_id) {
            player_info[ids].x = -850;
            player_info[ids].y = 20;
            player_info[ids].is_sep = 1;
            console.log("sep", ids, max_id);
        }
    } 
    }catch(e){console.log(e);}
    // console.log(player_info);
}
function newday(room) {
    if(!room_member[room]) return;
    try{
    room_phase[room] = 0;
    room_day[room] += 1;
    if (room_day[room] == max_day && room_res[room] == 0)
        room_res[room] = -1;
    
    /*buff*/
    for (ids of room_member[room]) if(player_info[ids]) {
        if (player_info[ids].to_meet[1]) 
            player_info[ids].buff = 1;
        else
            player_info[ids].buff = 0;
        player_info[ids].to_meet[1] = 0;
        player_info[ids].to_meet[0] = -1;
        if (Math.random() < 0.333) {
            var arr = Array.from(room_member[room]);
            eid = arr[gen_rand([0, arr.length - 1])];
            if (eid != ids) 
                player_info[ids].to_meet[0] = eid;
        }
    }
    }catch(e){console.log(e);}
}
function check_end_phase(room) {
    if(!room_member[room]) return 0;
    try{
    var flag = 0;

    if (phase_time[room] + ptime[room_phase[room]] < Date.now()) 
        flag = 1;
    if (room_phase[room] == 1) {
        var all_votes = 1;
        for (ids of room_member[room]) 
            if (player_info[ids].vote === 0) all_votes = 0;
        if (all_votes) flag = 1;
    }
    if (flag) {
        if (room_phase[room] != 0) {
            var inc = Date.now() - phase_time[room];
            for (ids of room_member[room]) 
                player_info[ids].state_end_time += inc;
        }
        phase_time[room] = Date.now();
        if (room_day[room] == max_day - 1) newday(room);
        else {
            if (room_phase[room] == 0) newvote(room);
            else if (room_phase[room] == 2) newday(room);
            else newdisplay(room);
        }
    }
    return 0;
    }catch(e){console.log(e);}
}

function check_end_game(room) {
    if(!room_member[room]) return 0;
    try{
    // 0 : if not ended; -1 if super spreader wins; 1 ow
    if (room_res[room] != 0) return ;
    grads = 0;
    total = 0;
    for (ids of room_member[room]) {
        cur = player_info[ids];
        if (cur.is_super) continue;
        total += 1;
        if (cur.tot_psets >= psets_to_grad) grads += 1;
    }
    if (grads >= total - 2) room_res[room] = 1;
    else if (room_infects[room] >= infects_to_win) room_res[room] = -1;
    else room_res[room] = 0;
    }catch(e){console.log(e);}
}
function gen_rand(u) {
    try{
    var x=u[0],y=u[1];
    return x + Math.floor(Math.random() * (y - x + 1));
}catch(e){console.log(e);}
}
function try_infect(sta, dest) {
    if(!player_info[sta]) return;
    if(!player_info[dest]) return;
    try{
    var pa=player_info[sta], pb=player_info[dest];
    if (pb.infected_state != 0) return ;
    if (pb.is_super) return ;
    if(Math.random()>=((!pa.mask_on)?3:1)*((!pb.mask_on)?2:1)*0.0005) return;
    if (!chk_seg([pa.x, pa.y], [pb.x, pb.y])) return ;
    var dis=(pa.x-pb.x)*(pa.x-pb.x)+(pa.y-pb.y)*(pa.y-pb.y);
    var dia=(pb.mask_on)?150:200,rad=dia/2;
    if(dis<=rad*rad) {
        set_state(dest, 1);
        console.log('congrats! player '+dest+' is infected!!! dis='+dis+" rad="+rad);
    }
}catch(e){console.log(e);}
}
function set_state(dest, state) {
    if(!player_info[dest]) return;
    try{
    player_info[dest].infected_state = state;
    lst_tm = gen_rand(lst_range[state]) * 1000;
    player_info[dest].state_end_time = Date.now() + lst_tm;
    var cp = player_info[dest];
    if (state == 1 && !cp.is_super) if(room_infects[room_id[dest]]!=undefined)
        room_infects[room_id[dest]] += 1;
    }catch(e){console.log(e);}
}
function pset_inc(id, r) {
    if(!player_info[id]) return;
    try{
    var fr = player_info[id].pset_progress;
    if (fr == -1) return ;
    fr += r;
    if (fr >= pset_size) {
        fr = -1; 
        player_info[id].tot_psets += 1;
    }
    player_info[id].pset_progress = fr;
}catch(e){console.log(e);}
}

io.on('connection', function (socket) {
    function update_state(room) {
        if(!room_member[room]) return;
        try{
        var info=get_info_of_room(room);
        for (t of room_member[room]) {
            io.to(t).emit('update_info', info);
        }
    }catch(e){console.log(e);}
    }
    console.log('user '+socket.id+' connected');
    var leave_room=function() {
        try{
        var id=socket.id;
        if(null==room_id[id]) return;
        var room=room_id[id];
        if(room!=null&&room_member[room]) {
            room_member[room].delete(id);
        }
        room_id[id]=null;
    }catch(e){console.log(e);}
    };
    function get_nick(id) {
        try{
        if(nick[id]) return nick[id];
        return id;
    }catch(e){console.log(e);}
    }
    socket.on("vote", function(dest){
        try{
        var sta = socket.id;
        if(!player_info[sta]) return;
        console.log("vote", sta, dest);
        player_info[sta].vote = dest;
    }catch(e){console.log(e);}
    })
    socket.on("get_pset", function() {
        try{
//        console.log('get_pset');
        var id = socket.id;
        if(!player_info[id]) return;
        if (player_info[id].tot_psets < psets_to_grad)
            player_info[id].pset_progress = Math.max(0, player_info[id].pset_progress);
        }catch(e){console.log(e);}
    })
    socket.on('join_group', function(groupid) {
        try{
        var id = socket.id;
        if(!player_info[id]) return;
        player_info[id].groupid = groupid;
    }catch(e){console.log(e);}
    })
    socket.on('pset_progress', function() {
        try{
        var id = socket.id;
        if(!player_info[id]) return;
        if(room_id[id]==null) return;
        var room = room_id[id];
        if(room_member[room]==null) return;
        var nowgp = player_info[id].groupid;
        for (ids of room_member[room]) 
            if (player_info[ids].groupid == nowgp)
                pset_inc(ids, 1 + player_info[id].buff);
            }catch(e){console.log(e);}
    })
    socket.on("start_game",function(room) {
        try{
        if(!room_member[room]) return;
        if(room_state[room]) return;
        room_infects[room] = 0;
        room_day[room] = 1;
        room_res[room] = 0;
        room_phase[room] = 0;
        votes_info[room] = {
            correct: 0, 
            wrong: 0, 
            skip: 0
        };
        phase_time[room] = Date.now();

        room_state[room]=true;
        for(var t of room_member[room]) {
            io.to(t).emit('start_game_pong');
        }
        total_num = room_member[room].size;
        var supid = gen_rand([0, total_num - 1]);
        var cnt = 0;
        for (t of room_member[room]) {
            u = {}
            while (1) {
                u.x = gen_rand([-300, 300]);
                u.y = gen_rand([-300, 300]);
                if (u.x ** 2 + u.y ** 2 > 200 ** 2) continue;
                else break;
            }
            u.mask_on = 0;
            u.tot_psets = 0;
            u.pset_progress = -1;
            u.infected_state = 0;
            u.state_end_time = 10**9
            u.vote = 0;
            u.groupid = -1;
            u.name = get_nick(t);
            u.get_votes = 0;
            u.is_sep = 0;
            if (cnt == supid)  
                u.is_super = 1;
            else 
                u.is_super = 0;
            u.buff = 0;
            u.to_meet = [-1, 0];
            player_info[t] = u;
            cnt += 1;
        }
    }catch(e){console.log(e);}
//        console.log(supid,total_num,cnt);
        room_watchers[room] = setInterval(function() { //check if any infection should happen
            try{
                check_end_phase(room);
            if (room_phase[room] == 0 && (room_day[room] != 1 || phase_time[room] < Date.now() - 10000)) {
                // infect and progress of infections
                for (sta of room_member[room]) if(player_info[sta]) {
                    if (player_info[sta].infected_state < 2) continue; 
                    for (dest of room_member[room]) 
                        try_infect(sta, dest);
                }
                curtime = Date.now();
                for (ids of room_member[room]) if(player_info[sta]) {
                    if (player_info[ids].infected_state == 0) continue;
                    if (player_info[ids].is_super) continue;
                    if (curtime > player_info[ids].state_end_time) {
                        es = player_info[ids].infected_state;
                        es = (es + 1) % 4;
                        set_state(ids, es);
                    }
                }
            }

            //check distance
            for (sta of room_member[room]) if(player_info[sta]) {
                for (dest of room_member[room]) if(player_info[dest]) {
                    if (dest == player_info[sta].to_meet[0]) {
                        var dis = 
                        (player_info[sta].x - player_info[dest].x) ** 2
                        + (player_info[sta].y - player_info[dest].y) ** 2;
                        if (dis < 25 ** 2) 
                            player_info[sta].to_meet[1] += 1;
                    }
                }
            }
            check_end_game(room);
        }catch(e){console.log(e);}
        },10);
    });
    socket.on("set_name", function(nickname) {
        try{
        nick[socket.id]=nickname;
    }catch(e){console.log(e);}
    });
    socket.on("shut_game", function(room) {
        try{
            if(room_watchers[room])
        clearInterval(room_watchers[room]);
    }catch(e){console.log(e);}
    });
    socket.on('update', function(state) { // update info
        //console.log('user state updated');
        //console.log(player_info);
        try{
        var id = socket.id;
        if(room_id[id]==null) return;
        var room = room_id[id];
        if(!player_info[id]) return;
        var nx = player_info[id].x;
        var ny = player_info[id].y;
        var flag = 1;
        if(state.day!=room_day[room]+(room_phase[room] == 2)||player_info[id].is_sep) {
            flag=0;
        }
        if (flag) { 
            player_info[id].x = state.x;
            player_info[id].y = state.y;
        }
        player_info[id].mask_on = state.mask_on;
        if (player_info[id].is_super)
            player_info[id].infected_state = state.infected_state;
        update_state(room);
    }catch(e){console.log(e);}
    });
    socket.on('disconnect', function () {
        try{
        console.log('user '+socket.id+' disconnected');
        leave_room();
    }catch(e){console.log(e);}
    });
    socket.on('chatmessage', function (msg, room) {
        try{
        if(!room_member[room]) return;
        var id=socket.id;
        for(var t of room_member[room]) {
            io.to(t).emit('newchat', "<" + get_nick(id) + ">: " + msg);
        }
        console.log("received");
    }catch(e){console.log(e);}
    });
    socket.on("connect_room",function(room) {
        try{
        if(room_state[room]) {
            socket.emit('connect_room_pong','game in progress');
            return;
        }
        if(room_member[room]&&room_member[room].size>=8) {
            socket.emit('connect_room_pong','room full');
            return;
        }
        var id=socket.id;
        if (get_nick(id) == "Skip Voting") {
            socket.emit('connect_room_pong','please do not use this nick');
            return;
        }
        function valid_nick(nick) {
            var letters = /^[A-Za-z0-9_]+$/;
            if(!nick.match(letters)) return false;
            return nick.length<=12&&nick.length>=1;
        }
        if (!valid_nick(get_nick(id))) {
            socket.emit('connect_room_pong','invalid nick, must be [1,12] in len, alphabets digits underscore');
            return;
        }
        if (room_member[room]) {
            for (var x of room_member[room]) {
                if (x == id) continue;
                if (get_nick(x) == get_nick(id)) {
                    socket.emit('connect_room_pong','username in use');
                    return;
                }
            }
        }
        console.log('socket '+id+'('+get_nick(id)+') is connectin room '+room);
        if(!room_member[room]) {
            room_member[room]=new Set();
        }
        is_ready[socket.id]=false;
        room_member[room].add(id);
        console.log('cur room size:'+room_member[room].size);
        room_id[id]=room;
        socket.emit('connect_room_pong','ok');
    }catch(e){console.log(e);}
    });
    socket.on("set_ready",function(state) {
        try{
        is_ready[socket.id]=state;
    }catch(e){console.log(e);}
    });
    socket.on("player_list_ping",function(room) {
        try{
        if(!room_member[room]) return;
        var list_pl=[];
        for(var t of room_member[room]) if(is_ready[t]!=null) {
            list_pl.push([get_nick(t),is_ready[t]]);
        }
        socket.emit("player_list_pong",list_pl);
    }catch(e){console.log(e);}
    });
    socket.on("leave_room",leave_room);

});