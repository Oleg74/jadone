'use strict';


var mongoose = require('mongoose'),

    _=require('underscore'),
    Order = mongoose.model('Order');

/**
 * Get awesome things
 */
exports.list= function(req, res) {

    Order.find()
       .sort('num')
        //.select('name index country region')
        .exec(function (err, result){
            if (err)
                return res.json(err);
            else {

                return res.json(result);
            }
        })
}


exports.get= function(req, res) {
    //console.log(req.body);
    Order.findById(req.params.id)

        .exec(function (err, result) {

        if (err) return res.json(err);

        res.json(result);})


}

exports.delete = function(req,res){
    Order.findByIdAndRemove(req.params.id, function (err,doc) {
        if (err) {console.log(err);return res.json(err);}

        res.json({});
    })
}


exports.add= function(req, res) {
//http://stackoverflow.com/questions/7267102/how-do-i-update-upsert-a-document-in-mongoose
//How do I update/upsert a document in Mongoose?
    console.log(req.body);
    var order = new Order(req.body);
    var upsertData = order.toObject();
    delete upsertData._id;
    //console.log(upsertData);

    Order.getLastNumberOrder(function(err,lastOrder){
        //console.log(lastOrder);
        //res.json({});
        if(!lastOrder[0] || !lastOrder[0].num){
            if (!upsertData.num){
                upsertData.num=2455;
            }
        }else {
            if (!upsertData.num){
                upsertData.num=++lastOrder[0].num;
            }
        }

        //console.log('date1-'+upsertData.date1);

        if (upsertData.status==2 && !upsertData.date1){
            upsertData.date1=Date.now();
        }
        if (upsertData.status==3 && !upsertData.date2){
            upsertData.date2=Date.now();
        }
        if (upsertData.status==4 && !upsertData.dat3){
            upsertData.date3=Date.now();
        }
        //console.log('date1-'+upsertData.date1);

        console.log(upsertData);
        Order.update({_id: order.id}, upsertData, {upsert: true}, function (err) {
            if (err) {console.log(err);return res.json(err);}
            res.json({});
    })

    });
}



/*

exports.delete = function(req,res){
    Comment.findById(req.params.id, function (err,doc) {
        Stuff.findById(doc.stuff,function(err,stuff){
            */
/*console.log(stuff.comments);
            console.log(comment.id);*//*

            //console.log(stuff.comments.indexOf(comment.id));
            //var i = stuff.comments.indexOf(req.params.id);
            var i=stuff.comments.indexOf(req.params.id);
            if (i>-1){
                stuff.comments.splice(i,1)
               // console.log(stuff.comments);
                stuff.save();
            }
            doc.remove();
            res.json({});
        })
        */
/*if (err) return res.json(err);
        // saved!
        res.json({});*//*

    })

}
*/




