const passport = require('passport');
const userModel = require('../../models/all-models').User;
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, 
    function (username, password, cb) {
      //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
      userModel.findOne({username})
          .then((user) => {
            if(!user) {
              return cb(null, false, {message: 'Incorrect email or password.'});
            }
            user.passwordCompare(password, (err, pass) => { 
              if (err) {
                cb(null, false, err);
              }              
              if (!user || !pass) {
                return cb(null, false, {message: 'Incorrect email or password.'});
              }
              return cb(null, user, {message: 'Logged In Successfully'});
        });
      })
      .catch(err => {
        cb(err);
      });
    }
));
passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey   : 'nvjdscijdijsiddwr44534534k3232'
},
function (jwtPayload, cb) {
  //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
  return userModel.findOne({username: jwtPayload.username})
    .then(user => {
      return cb(null, user);
    })
    .catch(err => {
      return cb(err);
    });
  }
));