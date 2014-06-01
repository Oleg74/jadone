'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Chat=mongoose.model('Chat');

exports.list= function(req, res) {
    var to=req.params.to;
    var from =req.params.from;
    var query={ $and: [ { members:to  }, {members:from} ] };
    Chat.findOne(query,function (err, result) {
        if (err) return res.json(err);
        if (result && result.chat) {
            res.json(result.chat);
        } else {
            res.json([]);
        }
    })
}

exports.listChats= function(req, res) {
    var from =req.params.from;
    var query= {members:from}  ;
    var user=[];
    function userTransform(item){
        return {name:item.name,_id:item._id};
    }
    Chat.find(query,"members",function (err, result) {
        //console.log(result);
        if (err) return res.json(err);
        for (var i=0;i<result.length;i++){
            //console.log(result[i].members);
            for (var j=0;j<result[i].members.length;j++){
                //console.log(result[i].members[j]);
                if (user.indexOf(result[i].members[j])<0 && result[i].members[j]!=from ){
                    user.push(result[i].members[j]);
                }
            }

        }
        console.log(user);

        User.find({'_id': { $in: user}},function(err,docs){
            var arr=[];
            arr = docs.map(userTransform);
            res.json(arr);
        })
    })
}

exports.listUsers= function(req, res) {

    function userTransform(item){
        return {name:item.name,_id:item._id};
    }
    User.find(function(err,docs){
        if (err) return res.json(err);
        var arr=[];
        arr = docs.map(userTransform);
        res.json(arr);
    })

}


