import mongoose from 'mongoose';
import { dbURL } from '../../config.json';
import print from '../modules/print';

// Connect to database
mongoose.connect(dbURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.once('open', () => print('status', 'Connected to database!'));
db.on('error', (error) => console.error(error));

const userSchema = new mongoose.Schema({
  userID: String,
  games: Number,
  private: Boolean,
  guesses: {
    correct: Number,
    wrong: Number,
    correctPercentage: String
  },
  streaks: {
    current: Number,
    highest: Number
  }
})

interface UserType {
  userID: string,
  games: number,
  private: boolean,
  guesses: {
    correct: number,
    wrong: number,
    correctPercentage: string
  },
  streaks: {
    current: number,
    highest: number
  }
}

const User = mongoose.model('User', userSchema);

export const getUser = async (userID: string): Promise<UserType> => {
  let user = await User.findOne({ userID });
 
  if (!user) {
    user = {
      userID,
      private: false,
      games: 0,
      guesses: {
        correct: 0,
        wrong: 0,
        correctPercentage: '0%'
      },
      streaks: {
        current: 0,
        highest: 0
      }
    }
    
    setUser(user);
  }

  return user;
}

export const setUser = async (user: UserType) => {
  const userDocument = await User.findOne({ userID: user.userID });

  if (!userDocument) {
    // Set new user
    const newUser = new User(user);

    newUser.save((err: any, object: any) => {
      if (err) console.error(err);
    });
  } else {
    // Update user
    userDocument.games = user.games;
    userDocument.guesses = user.guesses;
    userDocument.streaks = user.streaks;
    userDocument.private = user.private;

    userDocument.save((err: any, object: any) => {
      if (err) console.error(err);
    });
  }
}

