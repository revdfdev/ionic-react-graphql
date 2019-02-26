import { hash, compare, genSalt } from 'bcrypt';
import { sign } from 'jsonwebtoken';


const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return sign({ username, email }, secret, { expiresIn });
}

export default {
  User: {
    reservations: (parent, args, context, info) => parent.getReservations(),
  },

  Reservation: {
    user: (parent, args, context, info) => parent.getUser(),
  },

  Query: {
    getCurrentUser: async (parent, args, { currentUser, db }, info) => {
      if (!currentUser) {
        console.log("Not a current User")
        return null
      }
      try {
        const user = await db.User.findOne({
          where: {
            username: currentUser.username
          }
        });
        return user;
      } catch (err) {
        throw err;
      }
    },

    reservations: async (parent, args, { db }, info) => {
      try {
        const reservations = await db.Reservation.findAll()
      } catch (err) {
        throw err;
      }
    },
    
    reservation: async (parent, { id }, { db }, info) => {
      try {
        const reservation = await db.Reservation.findById(id)
      } catch (err) {
        throw err;
      }
    }
  },

  Mutation: {
    signUpUser: async (parent, { username, email, password }, { db }, info) => {
      try {
        const user = await db.User.findOne({ where: { email: email } })
        if (user) {
          throw new Error("User already exists");
        }
        const salt = await genSalt(12)
        const hashedPassword = await hash(password, salt);
        const newUser = db.User.create({
          username,
          password: hashedPassword,
          email
        });
        return { token: createToken(newUser, process.env.SECRET, '1hr') };
      } catch (err) {
        throw err;
      }
    },

    signInUser: async (parent, { username, password }, { db }, info) => {
      try {
        const user = await db.User.findOne({ username });
        if (!user) throw new Error("User not found");
        const validPassword = await compare(password, user.password);
        if (!validPassword) throw new Error("Invalid password");
        return { token: createToken(user, process.env.SECRET, '1hr') }
      } catch (err) {
        throw err;
      }
    },

    createReservation: async (parent, { name, hotelName, arrivalDate, departureDate, userId }, { db }, info) => {
      try {
        const created = await db.Reservation.create({
          name: name,
          hotelName: hotelName,
          arrivalDate: arrivalDate,
          departureDate: departureDate,
          userId: userId
        })
      } catch (err) {
        throw err;
      }
    },

    updateReservation: async (parent, { name, hotelName, arrivalDate, departureDate, id }, { db }, info) => {
      try {
        const updated = await db.Reservation.update({
          name: name,
          hotelName: hotelName,
          arrivalDate: arrivalDate,
          departureDate: departureDate,
        }, {
            where: {
              id: id
            }
          });
      } catch (err) {
        throw err;
      }
    },

    deleteReservation: async (parent, { id }, { db }, info) => {
      try {
        const destroyed = await db.Reservation.destroy({
          where: {
            id: id
          }
        });
      } catch (err) {
        throw err;
      }
    }
  }
};