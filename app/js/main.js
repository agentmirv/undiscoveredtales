// JavaScript source code
var game = new Phaser.Game(800, 600, Phaser.AUTO)

var GameState = {
    preload: function () {
        game.load.image('background', 'assets/images/debug-grid-1920x1920.png')
        game.load.image('pixelWhite', 'assets/images/FFFFFF-1.png')
        game.load.image('pixelBlack', 'assets/images/000000-1.png')
        game.load.image('pixelTransparent', 'assets/images/1x1.png')
        // frameWidth=9, frameHeight=9
        game.load.spritesheet('bubble-border', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAbAgMAAADwuhzGAAAADFBMVEUAAAD///8AAADMzMyl8w72AAAAAXRSTlMAQObYZgAAADlJREFUCNdjYGDQWrWqgQGT5poaGpqFSTMtDQWCFRj0PyrR/3+B7cGgmf+/AroLk2bg////AwMGDQCR0FKxG5KiwAAAAABJRU5ErkJggg==', 9, 9);
        game.load.image('bubble-tail', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVAgMAAADUeU0FAAAADFBMVEUAAAAAAAD////MzMyoZCTaAAAAAXRSTlMAQObYZgAAAC1JREFUCNdjCA3NWrXUAY36/xULxYyN+hu1amUAAyYVwoBBhYYyYFDh/w9gUADQUTeozcOYAwAAAABJRU5ErkJggg==');
        game.load.bitmapFont('8bitoperator', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACAAQMAAAD58POIAAAABlBMVEUAAAD///+l2Z/dAAAAAXRSTlMAQObYZgAABF9JREFUSMftlEur00AUx6cI0UXqxd0UpXXh0sWEgShYLCgIih9iSmC6SW/FC1Kx1kdFXRTrzoZC1W8gBLrxlVBINxOzkwbxUQJ1c9WWQL0XveqZpFyrH0E8q5nfnMd/zpkEEebeua2eOHGC5Hp6pUVQvRyJIL++vo61nm56GIlYr1g2Sk11EMp05arIi8V6HIvcM3TZmlYe9jmY38u0c10kHM8cU37pN2AJaKYgBEASsC7BRAK/65nvKefNpv8tc6eTgNq4tEx6HWqKmQxZgtZu0iKAy73YWysm0t/b6G9TxVDrM7hoG+W6jKsKFgalrD6PBNK6jqGo0ivf8OG+y5CmmH+8zmUs8nvkS9hnfo/muZhHbQnMnC0BBSXaKtjD/a52fQkaAArct+ZtdLlHapbNrkJIIwnRpMdLlgUAcRCi7eYosMY8dgDoAJp10JFKIvMoCGiydBiH66emrClMMMcAUC+H4RvdyLWZAB84E/HGxobOctcJmn8YdY4jP4lSx5RA0WQMmWgyiURoY4FTEFNKdVOC7XjtvRwDAGIGVAVtKsbIt6TLpiOBrsrJfUtCPKqI7cXeThFdbklQEQWlkWrMWbE2iT7I5Z4pnXGkzhJeuPPowFDXywtYs2H5JyUiig19wBgSjnubEkqFZxi6PZzCsCGYXBv43mQ0GCgcnmH0aoNQPRhFLd32OLoQ65yepPqrEY/1AefQQgAzmYMblCfg2JSSa08OBZ4RGZAUPBSoUnhwd88TBJaGlGiilJj4MNKsKKjDDWy+0wJAUH0GlT9uhjbPtugXSza0uB1rbQliaFwbNW/ypLt9noMZvlHQwoNXcKMdtouatTDfqWjxmfldFzxwuQseGC1+bG3PypADuxASPkGXXjMXcgQUu1a0GT5CupcAj+KdpHcAuGtN7iSPI6/sbAH47nZB241o1KH7HQwAjijXWnKceQBgnxUAUmZL3yJo61umBSDT07PuPa4SJD+sNfDoVYLhHq6yBOT6vNzT1z3aFBLszcBX6UIOAQNferQbPlQZ55V6CtZKzG8Zo4dSXVpFZfVE6SHnDHIOgg7YxATaSBwBAO50srnTI6BUm3dl94MOZS6At3ZjiFF9PoUj5rZI9aFNPAxV9AQ8ndUO2mSYgjFtbPdI1bKJKx+uXutCDuBplfpWZXO8BH1y4QwS2JM5nJiKUCqFEMUMXzQdud7byfPkH9SBTSngxwRMGKYvD4tlXh0MTBcAGDXrpwwFQC0A8PF5Z8O8ZSmlT+CRA1B+4tHsxccqzwII7SIATrPnHmNetXml08cJyFy0SMm3OUNgElTPnTKQtH3VQQLMW8XT6pAb+w8twVHoqFIeDg/qR+7LKlfOI+wZx+adN8bZw+jrcxCuYuFJD5Ta2nsV5doyh9yJ+ZSFL5uqszyVLSxbbaSwXdCiQ6ziXQck4sxtjFbBQSpwCRYrOWpj1PgNGlAFFdAfpnjOym4nHpjmKlAVCFm17Az9t3/TfgG1wI+/NyjOhQAAAABJRU5ErkJggg==', null, '<?xml version="1.0"?><font><info face="8bitoperator" size="11" bold="0" italic="0" charset="" unicode="1" stretchH="100" smooth="0" aa="0" padding="0,0,0,0" spacing="1,1" outline="0"/><common lineHeight="16" base="13" scaleW="128" scaleH="128" pages="1" packed="0" alphaChnl="0" redChnl="4" greenChnl="4" blueChnl="4"/><pages><page id="0" file="8bitoperator.png" /></pages><chars count="179"><char id="32" x="124" y="23" width="1" height="1" xoffset="0" yoffset="0" xadvance="6" page="0" chnl="15" /><char id="33" x="124" y="13" width="2" height="9" xoffset="1" yoffset="4" xadvance="4" page="0" chnl="15" /><char id="34" x="113" y="84" width="5" height="4" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="35" x="49" y="38" width="8" height="9" xoffset="1" yoffset="4" xadvance="10" page="0" chnl="15" /><char id="36" x="7" y="0" width="6" height="13" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="37" x="57" y="78" width="7" height="8" xoffset="1" yoffset="5" xadvance="9" page="0" chnl="15" /><char id="38" x="85" y="37" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="39" x="122" y="84" width="2" height="4" xoffset="1" yoffset="4" xadvance="4" page="0" chnl="15" /><char id="40" x="123" y="66" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="41" x="15" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="42" x="77" y="85" width="7" height="5" xoffset="1" yoffset="6" xadvance="9" page="0" chnl="15" /><char id="43" x="92" y="85" width="6" height="5" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="44" x="119" y="84" width="2" height="4" xoffset="1" yoffset="11" xadvance="4" page="0" chnl="15" /><char id="45" x="49" y="95" width="5" height="1" xoffset="1" yoffset="8" xadvance="7" page="0" chnl="15" /><char id="46" x="125" y="84" width="2" height="2" xoffset="1" yoffset="11" xadvance="4" page="0" chnl="15" /><char id="47" x="101" y="25" width="6" height="10" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="48" x="84" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="49" x="25" y="79" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="50" x="91" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="51" x="98" y="56" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="52" x="105" y="56" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="53" x="112" y="56" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="54" x="77" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="55" x="119" y="56" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="56" x="0" y="70" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="57" x="7" y="70" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="58" x="56" y="87" width="2" height="7" xoffset="1" yoffset="6" xadvance="4" page="0" chnl="15" /><char id="59" x="33" y="79" width="2" height="9" xoffset="1" yoffset="6" xadvance="4" page="0" chnl="15" /><char id="60" x="117" y="66" width="5" height="9" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="61" x="7" y="98" width="5" height="3" xoffset="1" yoffset="7" xadvance="7" page="0" chnl="15" /><char id="62" x="122" y="46" width="5" height="9" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="63" x="14" y="70" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="64" x="58" y="37" width="8" height="9" xoffset="1" yoffset="4" xadvance="10" page="0" chnl="15" /><char id="65" x="21" y="69" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="66" x="28" y="69" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="67" x="35" y="69" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="68" x="42" y="68" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="69" x="49" y="68" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="70" x="56" y="68" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="71" x="63" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="72" x="70" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="73" x="20" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="74" x="77" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="75" x="84" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="76" x="14" y="60" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="77" x="8" y="50" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="78" x="91" y="67" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="79" x="98" y="66" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="80" x="24" y="49" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="81" x="0" y="27" width="6" height="11" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="82" x="31" y="49" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="83" x="38" y="48" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="84" x="45" y="48" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="85" x="52" y="48" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="86" x="59" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="87" x="101" y="36" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="88" x="66" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="89" x="73" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="90" x="80" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="91" x="10" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="92" x="73" y="26" width="6" height="10" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="93" x="5" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="94" x="105" y="84" width="7" height="4" xoffset="1" yoffset="3" xadvance="9" page="0" chnl="15" /><char id="95" x="43" y="96" width="5" height="1" xoffset="0" yoffset="14" xadvance="5" page="0" chnl="15" /><char id="96" x="32" y="97" width="3" height="2" xoffset="1" yoffset="3" xadvance="5" page="0" chnl="15" /><char id="97" x="107" y="76" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="98" x="87" y="47" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="99" x="14" y="90" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="100" x="101" y="46" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="101" x="100" y="76" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="102" x="105" y="66" width="5" height="9" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="103" x="109" y="36" width="7" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="104" x="108" y="46" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="105" x="122" y="25" width="4" height="10" xoffset="1" yoffset="3" xadvance="6" page="0" chnl="15" /><char id="106" x="21" y="14" width="6" height="12" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="107" x="115" y="46" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="108" x="0" y="80" width="4" height="9" xoffset="1" yoffset="4" xadvance="6" page="0" chnl="15" /><char id="109" x="76" y="77" width="8" height="7" xoffset="1" yoffset="6" xadvance="10" page="0" chnl="15" /><char id="110" x="93" y="77" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="111" x="114" y="76" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="112" x="0" y="60" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="113" x="7" y="60" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="114" x="35" y="89" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="115" x="7" y="90" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="116" x="111" y="66" width="5" height="9" xoffset="1" yoffset="4" xadvance="7" page="0" chnl="15" /><char id="117" x="0" y="90" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="118" x="121" y="76" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="119" x="85" y="77" width="7" height="7" xoffset="1" yoffset="6" xadvance="9" page="0" chnl="15" /><char id="120" x="21" y="90" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="121" x="94" y="46" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="122" x="28" y="89" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="123" x="21" y="59" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="124" x="30" y="79" width="2" height="9" xoffset="1" yoffset="4" xadvance="4" page="0" chnl="15" /><char id="125" x="28" y="59" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="126" x="13" y="98" width="7" height="2" xoffset="1" yoffset="7" xadvance="9" page="0" chnl="15" /><char id="160" x="126" y="56" width="1" height="1" xoffset="0" yoffset="0" xadvance="6" page="0" chnl="15" /><char id="161" x="125" y="36" width="2" height="9" xoffset="1" yoffset="6" xadvance="4" page="0" chnl="15" /><char id="162" x="35" y="59" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="163" x="16" y="49" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="165" x="42" y="58" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="166" x="36" y="79" width="2" height="9" xoffset="1" yoffset="4" xadvance="4" page="0" chnl="15" /><char id="168" x="21" y="98" width="6" height="2" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="169" x="48" y="78" width="8" height="8" xoffset="1" yoffset="5" xadvance="10" page="0" chnl="15" /><char id="171" x="59" y="87" width="8" height="5" xoffset="1" yoffset="6" xadvance="10" page="0" chnl="15" /><char id="172" x="0" y="98" width="6" height="3" xoffset="1" yoffset="8" xadvance="8" page="0" chnl="15" /><char id="174" x="39" y="79" width="8" height="8" xoffset="1" yoffset="5" xadvance="10" page="0" chnl="15" /><char id="176" x="99" y="85" width="5" height="5" xoffset="1" yoffset="3" xadvance="7" page="0" chnl="15" /><char id="177" x="42" y="88" width="6" height="7" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="180" x="28" y="97" width="3" height="2" xoffset="1" yoffset="3" xadvance="5" page="0" chnl="15" /><char id="181" x="49" y="58" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="182" x="0" y="50" width="7" height="9" xoffset="1" yoffset="4" xadvance="9" page="0" chnl="15" /><char id="183" x="40" y="97" width="2" height="2" xoffset="1" yoffset="7" xadvance="4" page="0" chnl="15" /><char id="184" x="36" y="97" width="3" height="2" xoffset="1" yoffset="13" xadvance="5" page="0" chnl="15" /><char id="187" x="68" y="85" width="8" height="5" xoffset="1" yoffset="6" xadvance="10" page="0" chnl="15" /><char id="191" x="56" y="58" width="6" height="9" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="192" x="73" y="0" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="193" x="42" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="194" x="42" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="195" x="65" y="0" width="7" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="196" x="87" y="0" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="197" x="28" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="198" x="38" y="38" width="10" height="9" xoffset="1" yoffset="4" xadvance="12" page="0" chnl="15" /><char id="199" x="108" y="0" width="6" height="12" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="200" x="28" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="201" x="49" y="13" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="202" x="35" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="203" x="94" y="0" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="204" x="122" y="0" width="4" height="12" xoffset="1" yoffset="1" xadvance="6" page="0" chnl="15" /><char id="205" x="77" y="13" width="4" height="12" xoffset="1" yoffset="1" xadvance="6" page="0" chnl="15" /><char id="206" x="14" y="0" width="6" height="13" xoffset="0" yoffset="0" xadvance="6" page="0" chnl="15" /><char id="207" x="101" y="0" width="6" height="12" xoffset="0" yoffset="1" xadvance="6" page="0" chnl="15" /><char id="208" x="93" y="36" width="7" height="9" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="209" x="57" y="0" width="7" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="210" x="63" y="13" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="211" x="80" y="0" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="212" x="0" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="213" x="49" y="0" width="7" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="214" x="70" y="13" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="215" x="85" y="85" width="6" height="5" xoffset="1" yoffset="7" xadvance="8" page="0" chnl="15" /><char id="216" x="67" y="37" width="8" height="9" xoffset="0" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="217" x="35" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="218" x="14" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="219" x="21" y="0" width="6" height="13" xoffset="1" yoffset="0" xadvance="8" page="0" chnl="15" /><char id="220" x="7" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="221" x="0" y="14" width="6" height="12" xoffset="1" yoffset="1" xadvance="8" page="0" chnl="15" /><char id="222" x="63" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="223" x="70" y="57" width="6" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="224" x="87" y="25" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="225" x="94" y="25" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="226" x="110" y="13" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="227" x="14" y="27" width="7" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="228" x="45" y="27" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="229" x="82" y="13" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="230" x="65" y="77" width="10" height="7" xoffset="1" yoffset="6" xadvance="12" page="0" chnl="15" /><char id="231" x="59" y="26" width="6" height="10" xoffset="1" yoffset="6" xadvance="8" page="0" chnl="15" /><char id="232" x="108" y="25" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="233" x="21" y="38" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="234" x="7" y="27" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="235" x="115" y="25" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="236" x="33" y="38" width="4" height="10" xoffset="1" yoffset="3" xadvance="6" page="0" chnl="15" /><char id="237" x="28" y="38" width="4" height="10" xoffset="1" yoffset="3" xadvance="6" page="0" chnl="15" /><char id="238" x="117" y="13" width="6" height="11" xoffset="0" yoffset="2" xadvance="6" page="0" chnl="15" /><char id="239" x="0" y="39" width="6" height="10" xoffset="0" yoffset="3" xadvance="6" page="0" chnl="15" /><char id="240" x="117" y="36" width="7" height="9" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="241" x="22" y="27" width="7" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="242" x="7" y="39" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="243" x="14" y="38" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="244" x="103" y="13" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="245" x="30" y="27" width="7" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="246" x="38" y="27" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="247" x="49" y="87" width="6" height="7" xoffset="1" yoffset="5" xadvance="8" page="0" chnl="15" /><char id="248" x="76" y="37" width="8" height="9" xoffset="0" yoffset="5" xadvance="8" page="0" chnl="15" /><char id="249" x="52" y="26" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="250" x="66" y="26" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="251" x="96" y="13" width="6" height="11" xoffset="1" yoffset="2" xadvance="8" page="0" chnl="15" /><char id="252" x="80" y="26" width="6" height="10" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="253" x="115" y="0" width="6" height="12" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /><char id="254" x="89" y="13" width="6" height="11" xoffset="1" yoffset="4" xadvance="8" page="0" chnl="15" /><char id="255" x="56" y="13" width="6" height="12" xoffset="1" yoffset="3" xadvance="8" page="0" chnl="15" /></chars></font>');
    },

    create: function () {
        //this.background = this.game.add.sprite(0, 0, 'background')
        //this.cat = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'cat')
        //this.cat.anchor.setTo(0.5)
        //this.button = this.game.add.button(this.game.world.centerX, this.game.world.centerY, 'cat', buttonHandler)
        //this.button.anchor.setTo(0.5)

        game.add.tileSprite(0, 0, 1920, 1920, 'background');
        game.world.setBounds(0, 0, 1920, 1920);
        game.physics.startSystem(Phaser.Physics.P2JS);
        player = game.add.sprite(game.world.centerX, game.world.centerY, 'pixelTransparent');
        game.physics.p2.enable(player);
        cursors = game.input.keyboard.createCursorKeys();
        game.camera.follow(player);

        //box1 = game.add.image(0, 0, 'pixel')
        //box1.anchor.setTo(0.5)
        //box1.height = 100;
        //box1.width = 400;
        //box1.tint = 0xFFFFFF
        //box1.fixedToCamera = true;
        //box1.cameraOffset.setTo(game.camera.width / 2, game.camera.height / 2);

        //box2 = game.add.image(player.centerX, player.centerY, 'pixel')
        //box2.anchor.setTo(0.5)
        //box2.height = box1.height - 2;
        //box2.width = box1.width - 2;
        //box2.tint = 0x000000
        //box2.fixedToCamera = true;
        //box2.cameraOffset.setTo(game.camera.width / 2, game.camera.height / 2);

        var bubble = game.world.add(new ActionDialog(game, 0, 0, 400, "You step into the warmth of the house. A strange stillness hangs in the air, and your footsteps echo through the quiet entrance. Place your Investigator figures as indicated."));
        bubble.fixedToCamera = true;
        bubble.cameraOffset.setTo(game.camera.width / 2, game.camera.height / 2);
    },

    update: function () {
        player.body.setZeroVelocity();

        if (cursors.up.isDown) {
            player.body.moveUp(300)
        }
        else if (cursors.down.isDown) {
            player.body.moveDown(300);
        }

        if (cursors.left.isDown) {
            player.body.velocity.x = -300;
        }
        else if (cursors.right.isDown) {
            player.body.moveRight(300);
        }
    }
}

//function buttonHandler(sprite, pointer, isOver) {
//    sprite.scale.x *= -1
//    //alert(1)
//}

var ActionDialog = function (game, x, y, width, text) {
    Phaser.Sprite.call(this, game, x, y);

    // Some sensible minimum defaults
    width = width || 27;
    var height = 0;
    var edgeSize = 1;
    var leftBuffer = 20;
    var rightBuffer = 20;
    var topBuffer = 20;
    var bottomBuffer = 15;

    var style = { font: "16px Times New Romans", fill: "#ffffff", align: "center", wordWrap: true, wordWrapWidth: width };
    this.myText = game.add.text(x + leftBuffer, y + topBuffer, text, style);

    // Calculate the width and height needed for the edges
    var bounds = this.myText.getLocalBounds();
    if (width < bounds.width + leftBuffer + rightBuffer) {
        width = bounds.width + leftBuffer + rightBuffer;
    }
    if (height < bounds.height + topBuffer + bottomBuffer) {
        height = bounds.height + topBuffer + bottomBuffer;
    }

    // Create all of our corners and edges
    this.borders = [
        // background
        game.make.tileSprite(x + edgeSize, y + edgeSize, width - edgeSize, height - edgeSize, 'pixelBlack'),
        // top left
        game.make.image(x, y, 'pixelWhite'),
        // top right
        game.make.image(x + width, y, 'pixelWhite'),
        // bottom right
        game.make.image(x + width, y + height, 'pixelWhite'),
        // bottom left
        game.make.image(x, y + height, 'pixelWhite'),
        // top
        game.make.tileSprite(x + edgeSize, y, width - edgeSize, edgeSize, 'pixelWhite'),
        // bottom
        game.make.tileSprite(x + edgeSize, y + height, width - edgeSize, edgeSize, 'pixelWhite'),
        // left
        game.make.tileSprite(x, y + edgeSize, edgeSize, height - edgeSize, 'pixelWhite'),
        // right
        game.make.tileSprite(x + width, y + edgeSize, edgeSize, height - edgeSize, 'pixelWhite'),
    ];

    // Add all of the above to this sprite
    for (var b = 0, len = this.borders.length; b < len; b++) {
        this.addChild(this.borders[b]);
    }

    this.addChild(this.myText);
    this.myText.tint = 0xFFFFFF;

    this.pivot.set(Math.floor(width / 2), Math.floor(height / 2));
}

ActionDialog.prototype = Object.create(Phaser.Sprite.prototype);
ActionDialog.prototype.constructor = ActionDialog;

var SpeechBubble = function (game, x, y, width, text) {
    Phaser.Sprite.call(this, game, x, y);

    // Some sensible minimum defaults
    width = width || 27;
    var height = 18;

    // Set up our text and run our custom wrapping routine on it
    this.bitmapText = game.make.bitmapText(x + 12, y + 4, '8bitoperator', text, 22);
    SpeechBubble.wrapBitmapText(this.bitmapText, width);

    var style = { font: "14px Arial", fill: "#fff" };
    this.myText = game.add.text(x + 12, y + 4, "phaser 2.4 text bounds", style);
    this.myText.wordWrapWidth = width;

    // Calculate the width and height needed for the edges
    //var bounds = this.bitmapText.getLocalBounds();
    var bounds = this.myText.getLocalBounds();
    if (bounds.width + 18 > width) {
        width = bounds.width + 18;
    }
    if (bounds.height + 14 > height) {
        height = bounds.height + 14;
    }

    // Create all of our corners and edges
    // Numbers of the Frames (9x9 pixels)
    // 012
    // 345
    // 678
    this.borders = [
        // background
        game.make.tileSprite(x + 9, y + 9, width - 9, height - 9, 'bubble-border', 4),
        // top left
        game.make.image(x, y, 'bubble-border', 0),
        // top right
        game.make.image(x + width, y, 'bubble-border', 2),
        // bottom right
        game.make.image(x + width, y + height, 'bubble-border', 8),
        // bottom left
        game.make.image(x, y + height, 'bubble-border', 6),
        // top
        game.make.tileSprite(x + 9, y, width - 9, 9, 'bubble-border', 1),
        // bottom
        game.make.tileSprite(x + 9, y + height, width - 9, 9, 'bubble-border', 7),
        // left
        game.make.tileSprite(x, y + 9, 9, height - 9, 'bubble-border', 3),
        // right
        game.make.tileSprite(x + width, y + 9, 9, height - 9, 'bubble-border', 5)
    ];

    // Add all of the above to this sprite
    for (var b = 0, len = this.borders.length; b < len; b++) {
        this.addChild(this.borders[b]);
    }

    // Add the tail
    //this.tail = this.addChild(game.make.image(x + 18, y + 3 + height, 'bubble-tail'));

    // Add our text last so it's on top
    //this.addChild(this.bitmapText);
    //this.bitmapText.tint = 0x111111;
    this.addChild(this.myText);
    this.myText.tint = 0x111111;

    // Offset the position to be centered on the end of the tail
    //this.pivot.set(x + 25, y + height + 24);
    this.pivot.set(width / 2, height / 2);
};

SpeechBubble.prototype = Object.create(Phaser.Sprite.prototype);
SpeechBubble.prototype.constructor = SpeechBubble;

SpeechBubble.wrapBitmapText = function (bitmapText, maxWidth) {
    var words = bitmapText.text.split(' '), output = "", test = "";

    for (var w = 0, len = words.length; w < len; w++) {
        test += words[w] + " ";
        bitmapText.text = test;
        bitmapText.updateText();
        if (bitmapText.textWidth > maxWidth) {
            output += "\n" + words[w] + " ";
        }
        else {
            output += words[w] + " ";
        }
        test = output;
    }

    output = output.replace(/(\s)$/gm, ""); // remove trailing spaces
    bitmapText.text = output;
    bitmapText.updateText();
}

game.state.add('GameState', GameState)
game.state.start('GameState')
