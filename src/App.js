import React from 'react';
import ReactDOM from 'react-dom';

import './App.css';
import ROT from 'rot-js';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.onKeyPressed = this.onKeyPressed.bind(this);
    this.mapSetup = this.mapSetup.bind(this);

    this._map;
    this._entities = [];
    this.freeCell = [];
    this._data = {};
    this._tileSet = document.createElement("img");
    this._tileSet.src = "https://image.ibb.co/nBDfvk/Dungeon_Crawl_Project_Utumno_Tileset.png";
    this.options = {
      width: 64,
      height: 24,
      layout: "tile",
      bk: "transparent",
      tileWidth: 32,
      tileHeight: 32,
      tileSet: this._tileSet,
      tileMap: {
        "P":[64, 289],
        "D1":[0, 96],
        "D2": [96, 64],
        "D3":[287, 252],
        "D4":[64, 96],
        "H1":[0, 800],
        "W1":[96, 927],
        'W2':[125, 959],
        "W3":[1856, 896],
        'B1':[1792, 256],
        'w':[900, 402],
        'f':[740, 416]

    }
   };

   this.Entity = function() {
      this.type = props.type || "Player"
      this.char = props.char || "P";
      this.bk = props.bk || 'gray';
      this.x = props.x || 0;
      this.y = props.y || 0;
      this.weapon = props.weapons || "Wooden Club"
      this.health = props.health || 10;
      this.strength = props.strength || 5;
    };

    this.Entity.troll = function() {
      this.type = "Enemy";
      this.name = 'Troll';
      this.char = "D1";
      this.bk = 'white';
      this.x = 0;
      this.y = 0;
      this.health = 1;
      this.strength = 1;
    }

    this.Entity.orc = function(){
      this.type = "Enemy";
      this.name = 'Orc';
      this.char = "D2";
      this.bk = 'white';
      this.x = 0;
      this.y = 0;
      this.health = 1;
      this.strength = 3;
    }

    this.Entity.skeleton = function(){
      this.type = "Enemy";
      this.name = 'Soldier of the Undead';
      this.char = "D3";
      this.bk = 'white';
      this.x = 0;
      this.y = 0;
      this.health = 2;
      this.strength = 3;
    }

     this.Entity.dragon = function(){
      this.type = "Enemy";
      this.name = 'Dragon';
      this.char = "D4";
      this.bk = 'white';
      this.x = 0;
      this.y = 0;
      this.health = 3;
      this.strength = 3;
    }

    this.Entity.archMage = function() {
      this.type = 'Boss';
      this.name = 'Arch Mage';
      this.char = "B1";
      this.bk = 'white';
      this.x = 0;
      this.y = 0;
      this.health = 4;
      this.strength = 4;
    }

    this.Entity.player = new this.Entity();

    this.Item = function() {
      this.type = "Potion";
      this.name = 'Healing Potion';
      this.bk = "white";
      this.char = "H1";
      this.x = 0;
      this.y = 0;
      this.health = 5;
    }

    this.Item.axe = function() {
      this.type = "Weapon";
      this.name = 'Battle Axe';
      this.char = "W1";
      this.bk = 'white';
      this.x = 0;
      this.y = 0;
      this.health = 3;
      this.strength = 5;
    }

     this.Item.crossbow = function() {
      this.type = "Weapon";
      this.name = 'Crossbow';
      this.char = "W2";
      this.bk = 'white';
      this.x = 0;
      this.y = 0;
      this.health = 3;
      this.strength = 6;
    }

    this.Item.sword = function() {
      this.type = "Weapon";
      this.name = 'Flaming Sword';
      this.char = "W3";
      this.bk = 'white';
      this.x = 0;
      this.y = 0;
      this.health = 4;
      this.strength = 8;
    }

    this.Tile = function(props) {
      this.wall = props.wall || false;
      this.char = props.char || "f";
    };

    this.Tile.nullTile = new this.Tile({});

    this.Tile.floorTile = new this.Tile({
      char: 'f'
    });

    this.Tile.wallTile = new this.Tile({
      char: 'w',
      wall: true
    });

    this.Map = function(tiles) {
      this._tiles = tiles;
      this._width = tiles.length;
      this._height = tiles[0].length;
    };

    // Standard getters
    this.Map.prototype.getWidth = function() {
      return this._width;
    };
    this.Map.prototype.getHeight = function() {
      return this._height;
    };

    // Gets the tile for a given coordinate set
    this.Map.prototype.getTile = function(x, y) {
      // Make sure we are inside the bounds. If we aren't, return
      // null tile.
      if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
        return this.Tile.nullTile;
      } else {
        return this._tiles[x][y] || this.Tile.nullTile;
      }
    };

    this.Map.prototype.getRandomFloorPosition = function() {
      var x, y;
      do {
        x = Math.floor(Math.random() * 64);
        y = Math.floor(Math.random() * 24);
        var gly = this.getTile(x, y);
      } while (gly.wall)
      return {
        x: x,
        y: y
      };
    }



    this.display = new ROT.Display(this.options);
    this.display_canvas = this.display.getContainer();

    this.state = ({
      player: this.Entity.player,
      msg: "Defeat the Arch Mage and move on to the next Level to win the game. Click on the screen with your mouse and any arrow key to start!",
      level: 1,
      XP: 0
    })
  }

  mapSetup() {
    var map = [];
    for (var x = 0; x < this.options.width; x++) {
      // Create the nested array for the y values
      map.push([]);
      // Add all the tiles
      for (var y = 0; y < this.options.height; y++) {
        map[x].push(this.Tile.nullTile);
      }
    }
    // Setup the map generator
    var generator = new ROT.Map.Rogue(this.options.width, this.options.height);
      generator.create((x, y, v) => {
        this._data[x+","+y] = v;
        if (v === 0) {
          map[x][y] = this.Tile.floorTile;
        } else {
          map[x][y] = this.Tile.wallTile;
        }
      });
    this._map = new this.Map(map);

    var boss = this.Entity.archMage;
    this._entities.push(this.Entity.player, new boss);

    var demons = this.getDemonsByLevel(this.state.level);
    var health = this.getHealthByLevel(this.state.level);
    var weapons = this.getWeaponsByLevel(this.state.level);

    for(var i = 0; i<demons.length; i++){
      this._entities.push(demons[i])
    }
    for(var i = 0; i<health.length; i++){
      this._entities.push(health[i])
    }
    for(var i = 0; i<weapons.length; i++){
      this._entities.push(weapons[i])
    }

    this.addEntityAtRandomPosition(this._entities);
    this._drawWholeMap();
  }
  addEntityAtRandomPosition(entities) {
    for (var i = 0; i < entities.length; i++) {
      var position = this._map.getRandomFloorPosition();
      var entity = entities[i];
      entity.x = position.x;
      entity.y = position.y;
    }
  }
  getDemonsByLevel(gameLevel) {
    var troll = this.Entity.troll;
    var orc =  this.Entity.orc;
    var skeleton =  this.Entity.skeleton;
    var dragon = this.Entity.dragon;
    var enemy = []
    switch (gameLevel) {
      case 1:
        return enemy = [new troll, new troll, new troll , new troll, new troll, new troll, new troll, new troll, new troll];
        break;

      case 2:
        return enemy = [new troll, new troll, new troll, new troll, new orc, new orc, new orc, new orc]
        break;

      case 3:
        return enemy = [new skeleton, new skeleton, new skeleton, new skeleton, new skeleton, new skeleton, new skeleton, new skeleton, new skeleton, new skeleton]
        break;

      case 4:
        return enemy = [new skeleton, new skeleton, new skeleton, new dragon, new dragon, new dragon, new dragon, new dragon, new dragon, new dragon]
        break;

      case 5:
      return enemy = [new troll, new troll, new troll, new troll, new orc, new orc, new orc, new skeleton, new skeleton, new skeleton, new dragon, new dragon, new dragon]
    }
  }
  getHealthByLevel(gameLevel) {
    var potions = [];
    var health = this.Item;
    switch (gameLevel) {
      case 1:
      case 2:
      case 3:
      return potions=[new health, new health, new health, new health, new health, new health]
     break;

      case 4:
      case 5:
      return potions=[new health, new health, new health, new health, new health, new health, new health, new health, new health, new health]
    }
  }
 getWeaponsByLevel(gameLevel) {
   var weapons = [];
   var axe = this.Item.axe;
   var crossbow = this.Item.crossbow;
   var sword = this.Item.sword;
    switch (gameLevel) {
      case 1:
      case 2:
        return weapons = [new axe, new axe, new axe, new axe, new axe, new axe]
        break;

      case 3:
        return weapons = [new axe, new axe, new axe, new crossbow, new crossbow, new crossbow]
        break;

      case 4:
        return weapons = [new axe, new axe, new axe, new crossbow, new crossbow, new crossbow]
        break;

     case 5:
        return weapons = [new axe, new axe, new axe, new crossbow, new crossbow, new sword, new sword, new sword]
    }
 }
  componentDidMount() {
      document.addEventListener("keydown", this.onKeyPressed.bind(this));
      window.addEventListener('load', this.mapSetup());
    document.getElementById('board').appendChild(this.display_canvas);
  }

  componentWillUnmount() {
      document.removeEventListener("keydown", this.onKeyPressed.bind(this));
  }
  _drawWholeMap(display){
    this.display.clear();

    var lightPasses = (x, y) => {
    var key = x + "," + y;
      if (key in this._data && this._data[key] == 0) {
        return true;
      }
      return false;
    }

   var fov = new ROT.FOV.PreciseShadowcasting(lightPasses);

    fov.compute(this._entities[0].x, this._entities[0].y, 5, (x, y, r, visibility) => {
      this.display.draw(x, y, "f", "", "w");
      this._entities.forEach((d) => {
     if (d.x === x && d.y === y) {
      this.display.draw(d.x, d.y, d.char, d.bk);
        }
      });
    });

    this.setState({
      player: this._entities[0]
    })
  }

  onKeyPressed(e) {
    let x = this.Entity.player.x,
        y = this.Entity.player.y;
    var index = 0;

    var checkMove = (x, y) => {
      var checkArray = (array, x, y) => {
        return !array.every((entities, i) => {
          if (entities.x === x && entities.y === y) {
            index = i;
            return false;
          }
          return true;
        });
      };
      if (checkArray(this._entities, x, y)) {
        var it = this._entities[index];
        var player = this.Entity.player;
        if (it.type === "Potion") {
          var health = parseInt(it.health);
          player.health += health;
          this.setState({
            msg:"You have collected a Healing Potion!"
          })
          this._entities.splice(index, 1);
          this._drawWholeMap();
        } else if (it.type === "Weapon") {
          var strength = parseInt(it.health);
          player.strength += strength;
          player.weapon = it.name;
          this.setState({
            msg:"You have collected a "+it.name+"!"
          })
          this._entities.splice(index, 1);
          this._drawWholeMap();
        } else if (it.type==="Enemy"){
          var itDamage = (it.strength+(Math.floor(Math.random() * 5)));
          var myDamage =(player.strength+(Math.floor(Math.random() * 10)));
          this.fight(it, index, itDamage, myDamage);
        } else if(it.type==="Boss"){
          var itDamage = (it.strength+(Math.floor(Math.random() * 15)));
          var myDamage =(player.strength+(Math.floor(Math.random() * 10)));
          this.fight(it, index, itDamage, myDamage);
        }
      } else if (!this._map._tiles[x][y].wall) {
        this.Entity.player.x = x;
        this.Entity.player.y = y;
        this._drawWholeMap();
      } else null;
    }
      switch (e.keyCode) {
        case 37:
          checkMove(x - 1, y);
          break;
        case 39:
          checkMove(x + 1, y);
          break;
        case 38:
          checkMove(x, y - 1);
          break;
        case 40:
          checkMove(x, y + 1);
          break;
      }
  }
  fight(enemy,index, itDamage, myDamage){
    enemy.health-=myDamage;
    this.Entity.player.health-=itDamage;
    var msg = " ";
    var points = this.state.XP;

    if(this.Entity.player.health <=0){
      msg="You lost!";
      points=0;
      this.state.player.health=5;
      this.mapSetup();
    } else if(enemy.health <=0 && this.Entity.player.health >=0 && enemy.type ==="Boss") {
        msg = "You have defeated the Arch Mage! You have moved up one level!";
        this.levelUp();
    } else if(enemy.health <=0 && this.Entity.player.health >=0 && enemy.type ==="Enemy"){
    msg="You have defeated a "+enemy.name+"! You have gained 1 XP points!";
    points=points+=1;
      if(this.state.player.XP == 5){
        msg="You have collected 5 XP Points you're on to the next Level!"
        this.levelUp();
      }
    this._entities.splice(index, 1);
    this._drawWholeMap();
    } else{
      msg="Fight again";
      this.fight(enemy,index, itDamage, myDamage);
    }
    this.setState({
      msg: msg,
      XP: points
    })
  }
  levelUp(){
    var lvl = parseInt(this.state.level);
    lvl++;
    this.setState({
      level: lvl,
      XP: 0
    })
    if(lvl===5){
      alert("Congratulation! You have won the game!")
        this.display = new ROT.Display(this.options);
    }
   this.mapSetup();
  }
  render() {
    return (
    <div id="game">
      <div id="title">Dungeons and Demons</div>
      <div id="state">
        <span>Level:{this.state.level}|</span>
        <span>Health:{this.state.player.health}|</span>
        <span>Weapon:{this.state.player.weapon}|</span>
        <span>Strength:{this.state.player.strength}</span>
        <span>XP:{this.state.XP}</span>
      </div>
        <div id="msg">{this.state.msg}</div>
      <div id="board"></div>
    </div>
    )
  }
};

export default App;
