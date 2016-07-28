

export class Keys {

	public static keys: any = {};
	public static isSomeKeyPressed: boolean = false;
	public static currentKeyPressed: any = null;

	public static keyboard(keyCode: number) {
		let key = {
			code: null,
			isDown: null,
			isUp: null,
			press: undefined,
			release: undefined,
			downHandler: undefined,
			upHandler: undefined
		};

		key.code = keyCode;
		key.isDown = false;
		key.isUp = true;
		key.downHandler = (event) => {
			if (event.keyCode === key.code && (!this.currentKeyPressed || this.currentKeyPressed.code === key.code)) {
				if (key.isUp && key.press) key.press();
				key.isDown = true;
				key.isUp = false;
				this.currentKeyPressed = key;
				this.isSomeKeyPressed = true;
			}
			event.preventDefault();
		};

		key.upHandler = (event) => {
			if (event.keyCode === key.code && ((this.currentKeyPressed.code === key.code))) {
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

		this.keys[keyCode] = key;
		//return key;
	}



}
