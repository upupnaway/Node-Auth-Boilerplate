const jwt = require('jwt-simple');
const User = require('../models/user');
const config = require('../config')

function tokenForUser(user){
  //who does token belong to
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat:timestamp }, config.secret)
}

exports.signin = function(req,res,next){
  //user has already authd
  //we just need to give them a token.
  res.send({ token:tokenForUser(req.user) })
}

exports.signup = function(req,res,next){
  const email = req.body.email;
  const password = req.body.password;
  
  if(!email || !password){
    return res.status(422).send({ error: 'You must provide email and password' })
  }
  //see if a user with the given email exists
  User.findOne({ email: email }, function(err, existingUser){
    if(err) { return next(err); }
    
    else if(existingUser){
      return res.status(422).send({error: 'Email is in use'});
    }
  })
  
  const user = new User({
    email: email,
    password: password
  });
  
  user.save(function(err){
    if(err){ return next(err); }    
    //respond to request indicating hte user was created
    return res.json({ token:tokenForUser(user) });
  })
  
}