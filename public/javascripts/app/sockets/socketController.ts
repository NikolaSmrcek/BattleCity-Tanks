declare var io: any;
//declare var mySocket: any;

export class SocketController{

	public static socket: any;

	constructor(){
	}

	public static registerSocket(listener, callback){
		SocketController.checkSocketInit();
		SocketController.socket.on(listener,callback);
	}

	public static emit(destination, data){
		SocketController.checkSocketInit();
		SocketController.socket.emit(destination,data);
	}
	
	private static checkSocketInit(){
		if(SocketController.socket) return;
		SocketController.socket = io('http://localhost:8000');
	}
	
}