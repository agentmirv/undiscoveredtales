import Phaser from 'phaser'

export default class ActionDialogGroup extends Phaser.GameObjects.Group {
    constructor (scene, data) {
        super(scene)
        this.data = data
        this.setDepth(10)

        /*
        "id": "dialog-box-lobby",
        "imageKey": "search",
        "text": "A heavy wooden box lies on the table. The lid can be opened by moving an ornate latch.",
        "type": "action",
        "buttons": [
            { "text": "@ Search",
            "actions": [ {"type": "dialog", "dialogId": "dialog-box-lobby-skilltest"} ]
            }
        ]
        */

        
    }
}
