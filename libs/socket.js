module.exports = (io) => {
	io.on('connection', (socket) => {
		console.log('사용자 접속!')

		socket.on("client", (msg) => {
			console.log(msg)
		})

		socket.on("trans", (msg) => {
			console.log(msg)
			io.sockets.emit("alert", msg)
		})
	})
}