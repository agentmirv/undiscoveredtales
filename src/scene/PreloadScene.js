import Phaser from 'phaser'

export default class PreloadScene extends Phaser.Scene {
    constructor(){
        super({
            key: 'preload'
        })
    }

    preload() {
        this.loadAssets(this.cache.json.get('assets'))
    }

    create () {
        this.scene.start('main')
    }

    // https://github.com/johwiese/Phaser3-Loading-screen-asset-organization/blob/master/src/scenes/preload.js
    loadAssets (json)
    {
        Object.keys(json).forEach(function (group)
        {
            Object.keys(json[group]).forEach(function (key)
            {
                let value = json[group][key];

                if (group === 'atlas' ||
                    group === 'unityAtlas' ||
                    group === 'bitmapFont' ||
                    group === 'spritesheet' ||
                    group === 'multiatlas')
                {

                    // atlas:ƒ       (key, textureURL,  atlasURL,  textureXhrSettings, atlasXhrSettings)
                    // unityAtlas:ƒ  (key, textureURL,  atlasURL,  textureXhrSettings, atlasXhrSettings)
                    // bitmapFont ƒ  (key, textureURL,  xmlURL,    textureXhrSettings, xmlXhrSettings)
                    // spritesheet:ƒ (key, url,         config,    xhrSettings)
                    // multiatlas:ƒ  (key, textureURLs, atlasURLs, textureXhrSettings, atlasXhrSettings)
                    this.load[group](key, value[0], value[1]);

                }
                else if (group === 'audio')
                {

                    // do not add mp3 unless, you bought a license ;) 
                    // opus, webm and ogg are way better than mp3
                    if (value.hasOwnProperty('opus') && this.sys.game.device.audio.opus)
                    {
                        this.load[group](key, value['opus']);

                    }
                    else if (value.hasOwnProperty('webm') && this.sys.game.device.audio.webm)
                    {
                        this.load[group](key, value['webm']);

                    }
                    else if (value.hasOwnProperty('ogg') && this.sys.game.device.audio.ogg)
                    {
                        this.load[group](key, value['ogg']);

                    }
                    else if (value.hasOwnProperty('wav') && this.sys.game.device.audio.wav)
                    {
                        this.load[group](key, value['wav']);
                    }
                }
                else if (group === 'html')
                {
                    // html:ƒ (key, url, width, height, xhrSettings)
                    this.load[group](key, value[0], value[1], value[2]);

                }
                else
                {
                    // animation:ƒ (key, url, xhrSettings)
                    // binary:ƒ (key, url, xhrSettings)
                    // glsl:ƒ (key, url, xhrSettings)
                    // image:ƒ (key, url, xhrSettings)
                    // image:ƒ (key, [url, normal-url], xhrSettings)
                    // json:ƒ (key, url, xhrSettings)
                    // plugin:ƒ (key, url, xhrSettings)
                    // script:ƒ (key, url, xhrSettings)
                    // svg:ƒ (key, url, xhrSettings)
                    // text:ƒ (key, url, xhrSettings)
                    // tilemapCSV:ƒ (key, url, xhrSettings)
                    // tilemapTiledJSON:ƒ (key, url, xhrSettings)
                    // tilemapWeltmeister:ƒ (key, url, xhrSettings)
                    // xml:ƒ (key, url, xhrSettings)
                    this.load[group](key, value);
                }
            }, this);
        }, this);
    }    
}