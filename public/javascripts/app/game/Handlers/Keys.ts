

export class Keys {

	public static keys: any = {};

	constructor() {

	}

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
			if (event.keyCode === key.code) {
				if (key.isUp && key.press) key.press();
				key.isDown = true;
				key.isUp = false;
			}
			event.preventDefault();
		};

		key.upHandler = (event) => {
			if (event.keyCode === key.code) {
				if (key.isDown && key.release) key.release();
				key.isDown = false;
				key.isUp = true;
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
		return key;
	}



}
