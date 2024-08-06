require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = 6005;
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const userdb = require("../Modals/Google")

const clientid =process.env.CLIENT_ID
const clientsecret = process.env.CLIENT_SECRET



const corsOptions = {
    origin: (origin, callback) => {
      callback(null, true); // Allow all origins
    },
    methods: "GET, POST, PUT, DELETE",
    credentials: true // Be cautious with this setting when allowing all origins
  };
  
  app.use(cors(corsOptions));

  

app.use(express.json());

// setup session
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:true
}))

// setuppassport
app.use(passport.initialize());
app.use(passport.session());

passport.use(
    new OAuth2Strategy({
        clientID:clientid,
        clientSecret:clientsecret,
        callbackURL:"/auth/google/callback",
        scope:["profile","email"]
    },
    async(accessToken,refreshToken,profile,done)=>{
        try {
            let user = await userdb.findOne({googleId:profile.id});

            if(!user){
                user = new userdb({
                    googleId:profile.id,
                    displayName:profile.displayName,
                    email:profile.emails[0].value,
                    image:profile.photos[0].value
                });

                await user.save();
            }

            return done(null,user)
        } catch (error) {
            return done(error,null)
        }
    }
    )
)

passport.serializeUser((user, done) => {
    done(null, user.id);  // Store only user ID in the session for minimized session size
});

// Deserialize user from ID stored in the session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await userdb.findById(id);
        done(null, user);
        
    } catch (err) {
        done(err, null);
    }
});

// initial google ouath login
app.get("/auth/google",passport.authenticate("google",{scope:["profile","email"]}));

app.get("/auth/google/callback",passport.authenticate("google",{
    successRedirect:"http://localhost:4500/",
    failureRedirect:"http://localhost:4500/login"
}))



app.get("/login/success",async(req,res)=>{

    if(req.user){
        res.status(200).json({message:"user Login",user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})

app.get("/logout",(req,res,next)=>{

    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:4500");
    })
})


  app.get('/user/google/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
      const user = await userdb.findById(userId).select('-password'); 
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
   
      res.json({name: user.username, ...user.toObject()});
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Error fetching user", error: error.message });
    }
  });



app.post('/addHotel/:userId', async (req, res) => {
    const { userId } = req.params;
    const { hotelId } = req.body;

    try {
        // Find the user and update their hotels array
        const user = await User.findByIdAndUpdate(userId, {
            $addToSet: { Hotel: hotelId }  // $addToSet prevents duplicates
        }, { new: true }).populate('Hotel');

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


module.exports = app