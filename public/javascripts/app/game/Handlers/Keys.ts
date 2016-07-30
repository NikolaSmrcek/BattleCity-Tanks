import { Config } from '../Config/Config';

export class Keys {

	public static keys: any = {};
	public static isSomeKeyPressed: boolean = false;
	public static currentKeyPressed: any = null;

	public static keyboard(_key: any) {
		let key = {
			code: parseInt(_key.keyCode,10),
			name: _key.action,
			moveAndAction: _key.moveAndAction,
			isDown: false,
			isUp: true,
			press: undefined,
			release: undefined,
			downHandler: undefined,
			upHandler: undefined
		};
		//&& ((!this.currentKeyPressed || this.currentKeyPressed.code === key.code) || key.moveAndAction)
		key.downHandler = (event) => {
			if (event.keyCode === key.code && ((!this.currentKeyPressed || this.currentKeyPressed.code === key.code) || key.moveAndAction)) {
				if (key.isUp && key.press) key.press();
				key.isDown = true;
				key.isUp = false;
				this.currentKeyPressed = key;
				this.isSomeKeyPressed = true;
			}
			event.preventDefault();
		};
		//&& ((this.currentKeyPressed.code === key.code) || key.moveAndAction )
		key.upHandler = (event) => {
			if (event.keyCode === key.code && ((this.currentKeyPressed.code === key.code) || key.moveAndAction )) {
				//TODO test it maybe it needs some smoothing, example enable shooting and moving
				if (key.isDown && key.release) key.release();
				key.isDown = false;
				key.isUp = true;
				this.currentKeyPressed = null;
				this.isSomeKeyPressed = false;
			}
			event.preventDefault();
		};

		window.addEventListener(
			"keydown", key.downHandler.bind(key), false
		);

		window.addEventListener(
			"keyup", key.upHandler.bind(key), false
		);

		this.keys[key.code] = key;
		//return key;
	}



}
