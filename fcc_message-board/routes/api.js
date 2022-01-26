/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

mongoose.set('useFindAndModify', false);

//connect to database using mongoose
mongoose.connect(process.env.DB)

//from quick start guide in mongoose docs
let db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error'));
db.once('open', function (){
  console.log("DB sucess using mongoose!");
});


//reply schema and model
const replySchema = new Schema({
  text: {type: String, required: true},
  thread_id: {type: Schema.Types.ObjectId},
  created_on: {type: Date},
  updated_on: {type: Date},
  delete_password: {type: String},
  reported: {type: Boolean}
});

const Reply = mongoose.model('Reply', replySchema);


//thread schema and model
const threadSchema = new Schema({
  board: {type: String, required: true},
  text: {type: String, required: true},
  created_on: {type: Date, required: true},
  bumped_on: {type: Date, required: true},
  delete_password: {type: String, required: true},
  reported: {type: Boolean},
  replies: [replySchema]
});

const Thread = mongoose.model('Thread', threadSchema);


module.exports = function (app) {
  
  app.route('/api/threads/:board')
  .get(function(req, res){
    Thread.find(
      {board: req.params.board},
      'text created_on bumped_on replies ',
      {sort: {'bumped_on': -1}, limit: 10},
      function(err, doc){
        if(err){console.error(err)}; 
        const newThreadArray = doc.map(countReduceReplies);
        res.json(newThreadArray);
      }
      )
    })
    
    .post(function (req, res) {
      const newThread = new Thread({
        board: req.params.board,
        text: req.body.text,
        created_on: new Date(),
        bumped_on: new Date(),
        delete_password: req.body.delete_password
      })
      
      newThread.save(function(err, doc){
        if(err){console.error(err)};
        res.redirect(302, `/b/${req.params.board}`);
      })
    })
    
    .put(function (req, res) {
      Thread.findByIdAndUpdate(req.body.thread_id, {reported: true}, function(err, thread){
        if(err){console.error(err)};
        res.send("success");
      })
      
    })
    
    .delete(function(req, res){
      Thread.findById(req.body.thread_id, (err, thread) => {
        if(err){console.error(err)};
        if(thread.delete_password !== req.body.delete_password){
          res.send("incorrect password")
        } else {
          Thread.deleteOne({_id: thread._id}, (err, deletedThread) => {
            if(err){console.error(err)};
            res.send('success');
          })
        }
      })
    });
    
    
    
    
    
    app.route('/api/replies/:board')
    .get(function (req, res) {
      if(!req.query.thread_id){res.send('must provide thread_id in query e.g. /route?thread_id=######')}
      else{
        Thread.findById(req.query.thread_id, 'text created_on bumped_on replies ', function (err, thread) {
          if(err){console.error(err)};

          thread.replies.sort(function(a,b){
            return new Date(b.created_on) - new Date(a.created_on);
          });

          thread.replies = thread.replies.map(reply => {
            return {
              "_id": reply._id,
              "text": reply.text,
              "thread_id": reply.thread_id,
              "created_on": reply.created_on,
              "updated_on": reply.updated_on
            }
          })
          res.json(thread);
        })
      }
    })
    
    .post(function (req, res) {
      const reply = new Reply({
        text: req.body.text,
        thread_id: req.body.thread_id,
        created_on: new Date(),
        updated_on: new Date(),
        delete_password: req.body.delete_password
      })
      
      Thread.findById(req.body.thread_id, function(err, thread) {
        thread.replies.push(reply);
        thread.bumped_on = new Date();
        thread.save(function(err, savedThread) {
          if(err){console.error(err)};
          res.redirect(302, `/b/${req.params.board}/${req.body.thread_id}`);
        })
      })
    })

    .put(function(req, res) {
      Thread.findById(req.body.thread_id, function(err, thread){
        if(err){console.error(err)};
        thread.replies.find(reply => reply._id == req.body.reply_id)
        .reported = true;

        thread.save(function(err, savedThread) {
          if(err){console.error(err)};
          res.send('success');
          
        })
        
      })
      
    })

    .delete(function(req, res) {
      Thread.findById(req.body.thread_id, function(err, thread){
        if(err){console.error(err)};
        let targetReply = thread.replies.find(reply => reply._id == req.body.reply_id);
        if(req.body.delete_password !== targetReply.delete_password){
          res.send('incorrect password')
        } else {
          targetReply.text = '[deleted]';
          thread.save(function(err, doc){if(err){console.error(err)}});
          res.send('success');
        }
      })
    })
    ;
    
    
    //function to reduce thread to 3 most recent replies
    function countReduceReplies(mongoDoc) {
      const { ...thread } = mongoDoc._doc;
      const replyCount = thread.replies.length;
      thread.replycount = replyCount;
      
      thread.replies.sort(function(a,b){
        return new Date(b.created_on) - new Date(a.created_on);
      });
      
      thread.replies = thread.replies.slice(0, 3);
      
      return thread;
      
    }
  };
  
  
  