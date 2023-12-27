const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

function initialize(passport, getUserByEmail, getUserById)
{
	const authenticateUser = async (email, password, done) =>
	{
		const user = await getUserByEmail(email);
		if (user == null) return done(null, false);

		try
		{
			if (await bcrypt.compare(password, user.password)) return done(null, user);
			else return done(null, false);
		} catch (e) { return done(e); }
	}

	passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, authenticateUser));
	passport.serializeUser((user, done) => {
		console.log(user);
		return done(null, user._id.valueOf())
	});
	
	passport.deserializeUser(async (id, done) =>
	{
		const user = await getUserById(id)
		console.log(id, user)
		return done(null, user);
	});
}

module.exports = initialize;