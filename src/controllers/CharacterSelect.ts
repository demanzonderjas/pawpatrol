import { pups } from "../configs/gameplay";
import type { GameplayController } from "./Gameplay";
import { keyboard } from "./Keyboard";

export class CharacterSelectController {
    gameplay: GameplayController = null;

    constructor(gameplay: GameplayController) {
        this.gameplay = gameplay;

        keyboard.addListener({ event: "keyup", callback: this.handleSelect.bind(this) });
    }

    handleSelect(event: KeyboardEvent) {
        const { key } = event;
        const matchingCharacter = pups.find((pup) => pup.character === key);
        if (!matchingCharacter) {
            return;
        }
        this.gameplay.loadCharacter(matchingCharacter);
    }
}
