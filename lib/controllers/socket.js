'use strict';
/* module.exports = function (socket) {
   socket.emit('send:name', {
        name: 'Bob'
    });

    setInterval(function () {
        socket.emit('send:time', {
            time: (new Date()).toString()
        });
    }, 1000);
};*/



var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Chat=mongoose.model('Chat'),
    usersChat={};

module.exports = function (socket) {
    console.log('user connection!');
    /*setInterval(function () {
        socket.emit('send:time', {
            time: (new Date()).toString()
        });
    }, 1000);*/
    socket.emit('what user');

    socket.on('new user',function(data,callback){
        console.log(data+'new user');
        if((data in usersChat)||!data){
            callback(false)
        } else {
        // chech avalable users with the same id
            callback(true)
            socket.nickname=data;
            usersChat[socket.nickname]=socket;
            updateNickName();
        }
    })
    function userTransform(item){
        return {name:item.name,_id:item._id};
    }

    function updateNickName(){
        //if (Object.keys(usersChat).length<1) return;
        /*var qriteria = Object.keys(usersChat);
        console.log('query-'+qriteria);
*/
        User.find({
            '_id': { $in: Object.keys(usersChat)}},function(err,docs){
            var res=[];
            res = docs.map(userTransform);
            socket.broadcast.emit('username',res);
        })
        //io.sockets.emit('username',Object.keys(users));
    }

    socket.on('whatusers',function(data,callback){
        //console.log(data+'new user');
        if(data in usersChat){
            callback(false)
        } else {
            callback(true);
        }
        User.find({
            '_id': { $in: Object.keys(usersChat)}},function(err,docs){
            var res=[];
            res = docs.map(userTransform);
            socket.emit('username',res);

        })


/*User.find({
            '_id': { $in: Object.keys(usersChat)}},function(err,docs){
            var res=[];
            res = docs.map(userTransform);
            callback(res);

        })*/

       // callback({users:User.find({_id:Object.keys(usersChat)})})
       /* socket.nickname=data;
        usersChat[socket.nickname]=socket;
        updateNickName();*/

        //}
    })
    socket.on('delete user',function(data){
        if(!socket.nickname) return;
        delete usersChat[socket.nickname];
        updateNickName();
    })

    socket.on('disconnect',function(data){
        if(!socket.nickname) return;
        delete usersChat[socket.nickname];
        updateNickName();
    })


    socket.on('new:msg',function(data,callback){
        var msg=data.msg.trim();
        var to=data.to;
        var from = data.from;
        var date = Date.now();
        var query={$and:[{members:to},{members:from}]};
        Chat.findOne(query,function (err, chat) {
            if (!chat){
                chat= new Chat({members:[to,from]});
            }
            if (err) throw err;
            chat.chat.push({user:from,msg:msg,date:date});
            chat.save();
            if(data.to in usersChat){
                usersChat[data.to]
                    .emit('new:msg',{msg:msg,date:date,from:from});
            }
            callback({date:date,msg:msg});
        })


        /*if(data.to in usersChat){
            usersChat[data.to]
                .emit('new:msg',{msg:msg,nick:socket.nickname});
        }


        var msg=data.trim();
        if(msg.substring(0,3)==='/w '){
            msg=msg.substring(3);
            var ind = msg.indexOf(' ');
            if (ind !=-1){
                var name = msg.substring(0,ind);
                var msg=msg.substring(ind+1);
                if(name in users){
                    users[name].emit('whisper',{msg:msg,nick:socket.nickname});
                    socket.emit('whisper',{msg:msg,nick:socket.nickname});
                    console.log('whisper');
                } else{
                    callback('Error! Enter a valid user.');
                }

            } else {
                callback('Error! Please enter a massage for your whisper.');
            }
        }else{
            var newMsg=new Chat({msg:msg,nick:socket.nickname});
            newMsg.save(function(err){
                if (err) throw err;
                io.sockets.emit('new message',{msg:msg,nick:socket.nickname});
            });

        }*/
    })


   // var name = userNames.getGuestName();

    // send the new user their name and a list of users
    /*socket.emit('init', {
        name: name,
        users: userNames.get()
    });

    // notify other clients that a new user has joined
    socket.broadcast.emit('user:join', {
        name: name
    });

    // broadcast a user's message to other users
    socket.on('send:message', function (data) {
        socket.broadcast.emit('send:message', {
            user: name,
            text: data.message
        });
    });

    // validate a user's name change, and broadcast it on success
    socket.on('change:name', function (data, fn) {
        if (userNames.claim(data.name)) {
            var oldName = name;
            userNames.free(oldName);

            name = data.name;

            socket.broadcast.emit('change:name', {
                oldName: oldName,
                newName: name
            });

            fn(true);
        } else {
            fn(false);
        }
    });

    // clean up when a user leaves, and broadcast it to other users
    socket.on('disconnect', function () {
        socket.broadcast.emit('user:left', {
            name: name
        });
        userNames.free(name);
    });*/

};

