/**
 * New node file
 */
module.exports = function(app) {
	 app.use('/', 			require('./golbal'));
	 app.use('/users', 		require('./users'));
	 app.use('/action', 	require('./action'));
	 app.use('/student', 	require('./student'));
	 app.use('/mysql', 		require('./mysql'));
}