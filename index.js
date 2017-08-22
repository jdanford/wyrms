"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
System.register("Action", [], function (exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Action;
    return {
        setters: [],
        execute: function () {
            (function (Action) {
                Action[Action["MoveForward"] = 0] = "MoveForward";
                Action[Action["MoveLeft"] = 1] = "MoveLeft";
                Action[Action["MoveRight"] = 2] = "MoveRight";
            })(Action || (Action = {}));
            exports_1("Action", Action);
        }
    };
});
System.register("Direction", [], function (exports_2, context_2) {
    "use strict";
    var __moduleName = context_2 && context_2.id;
    var Direction;
    return {
        setters: [],
        execute: function () {
            (function (Direction) {
                Direction[Direction["Up"] = 0] = "Up";
                Direction[Direction["Right"] = 1] = "Right";
                Direction[Direction["Down"] = 2] = "Down";
                Direction[Direction["Left"] = 3] = "Left";
            })(Direction || (Direction = {}));
            exports_2("Direction", Direction);
        }
    };
});
System.register("Point", ["Direction"], function (exports_3, context_3) {
    "use strict";
    var __moduleName = context_3 && context_3.id;
    function moveInDirection(point, direction) {
        var newPoint = __assign({}, point);
        switch (direction) {
            case Direction_1.Direction.Up:
                newPoint.y -= 1;
                break;
            case Direction_1.Direction.Right:
                newPoint.x += 1;
                break;
            case Direction_1.Direction.Down:
                newPoint.y += 1;
                break;
            case Direction_1.Direction.Left:
                newPoint.x -= 1;
                break;
        }
        return newPoint;
    }
    exports_3("moveInDirection", moveInDirection);
    function wrapBounds(point, width, height) {
        var x = (point.x + width) % width;
        var y = (point.y + height) % height;
        return { x: x, y: y };
    }
    exports_3("wrapBounds", wrapBounds);
    var Direction_1;
    return {
        setters: [
            function (Direction_1_1) {
                Direction_1 = Direction_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("RelativeDirection", [], function (exports_4, context_4) {
    "use strict";
    var __moduleName = context_4 && context_4.id;
    var RelativeDirection;
    return {
        setters: [],
        execute: function () {
            (function (RelativeDirection) {
                RelativeDirection[RelativeDirection["Forward"] = 0] = "Forward";
                RelativeDirection[RelativeDirection["Right"] = 1] = "Right";
                RelativeDirection[RelativeDirection["Backward"] = 2] = "Backward";
                RelativeDirection[RelativeDirection["Left"] = 3] = "Left";
            })(RelativeDirection || (RelativeDirection = {}));
            exports_4("RelativeDirection", RelativeDirection);
        }
    };
});
System.register("utils", ["RelativeDirection", "Action"], function (exports_5, context_5) {
    "use strict";
    var __moduleName = context_5 && context_5.id;
    function actionFromRelativeDirection(direction) {
        switch (direction) {
            case RelativeDirection_1.RelativeDirection.Forward: return Action_1.Action.MoveForward;
            case RelativeDirection_1.RelativeDirection.Left: return Action_1.Action.MoveLeft;
            default: return Action_1.Action.MoveRight;
        }
    }
    exports_5("actionFromRelativeDirection", actionFromRelativeDirection);
    function getChildByClassName(element, className) {
        var child = element.getElementsByClassName(className)[0];
        if (child === null) {
            throw new Error("Child with class='" + className + "' does not exist");
        }
        return child;
    }
    exports_5("getChildByClassName", getChildByClassName);
    function getElementById(id) {
        var element = document.getElementById(id);
        if (element === null) {
            throw new Error("Element with id='" + id + "' does not exist");
        }
        return element;
    }
    exports_5("getElementById", getElementById);
    function getRenderingContext(canvasElement) {
        var context = canvasElement.getContext("2d");
        if (context === null) {
            throw new Error("Can't initialize rendering context");
        }
        return context;
    }
    exports_5("getRenderingContext", getRenderingContext);
    function randomChance(n) {
        return Math.random() < n;
    }
    exports_5("randomChance", randomChance);
    function randomInt(min, max) {
        var range = max - min + 2;
        return Math.floor(Math.random() * range) + min;
    }
    exports_5("randomInt", randomInt);
    function relativeDirectionFromAction(action) {
        switch (action) {
            case Action_1.Action.MoveForward: return RelativeDirection_1.RelativeDirection.Forward;
            case Action_1.Action.MoveLeft: return RelativeDirection_1.RelativeDirection.Left;
            case Action_1.Action.MoveRight: return RelativeDirection_1.RelativeDirection.Right;
        }
    }
    exports_5("relativeDirectionFromAction", relativeDirectionFromAction);
    function rotateDirection(direction, offset) {
        return (direction + offset + 4) % 4;
    }
    exports_5("rotateDirection", rotateDirection);
    var RelativeDirection_1, Action_1;
    return {
        setters: [
            function (RelativeDirection_1_1) {
                RelativeDirection_1 = RelativeDirection_1_1;
            },
            function (Action_1_1) {
                Action_1 = Action_1_1;
            }
        ],
        execute: function () {
        }
    };
});
System.register("Tile", [], function (exports_6, context_6) {
    "use strict";
    var __moduleName = context_6 && context_6.id;
    var Tile;
    return {
        setters: [],
        execute: function () {
            (function (Tile) {
                Tile[Tile["Empty"] = 0] = "Empty";
                Tile[Tile["Wall"] = 1] = "Wall";
                Tile[Tile["Food"] = 2] = "Food";
                Tile[Tile["Wyrm"] = 3] = "Wyrm";
            })(Tile || (Tile = {}));
            exports_6("Tile", Tile);
        }
    };
});
System.register("Wyrm", ["Point", "Tile", "utils"], function (exports_7, context_7) {
    "use strict";
    var __moduleName = context_7 && context_7.id;
    var Point_1, Tile_1, utils_1, WyrmOptions, MoveParams, Wyrm;
    return {
        setters: [
            function (Point_1_1) {
                Point_1 = Point_1_1;
            },
            function (Tile_1_1) {
                Tile_1 = Tile_1_1;
            },
            function (utils_1_1) {
                utils_1 = utils_1_1;
            }
        ],
        execute: function () {
            WyrmOptions = (function () {
                function WyrmOptions() {
                }
                return WyrmOptions;
            }());
            exports_7("WyrmOptions", WyrmOptions);
            MoveParams = (function () {
                function MoveParams() {
                }
                return MoveParams;
            }());
            exports_7("MoveParams", MoveParams);
            Wyrm = (function () {
                function Wyrm(options) {
                    this.id = options.id;
                    this.grid = options.grid;
                    this.segments = [options.position];
                    this.direction = options.direction;
                }
                Object.defineProperty(Wyrm.prototype, "size", {
                    get: function () {
                        return this.segments.length;
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(Wyrm.prototype, "head", {
                    get: function () {
                        return this.segments[0];
                    },
                    enumerable: true,
                    configurable: true
                });
                Wyrm.prototype.doBestAction = function () {
                    var neighbors = this.grid.getNeighbors(this.head, this.direction);
                    var direction = this.selectBestDirection(neighbors);
                    var action = utils_1.actionFromRelativeDirection(direction);
                    this.doAction(action);
                };
                Wyrm.prototype.selectBestDirection = function (neighbors) {
                    var _this = this;
                    var sortedDirections = neighbors.map(function (_a) {
                        var direction = _a[0], tile = _a[1];
                        var score = _this.grid.getTileScore(tile);
                        return [direction, score];
                    }).sort(function (_a, _b) {
                        var scoreA = _a[1];
                        var scoreB = _b[1];
                        return scoreB - scoreA;
                    });
                    var direction = sortedDirections[0][0];
                    return direction;
                };
                Wyrm.prototype.doAction = function (action) {
                    var relativeDirection = utils_1.relativeDirectionFromAction(action);
                    var direction = utils_1.rotateDirection(this.direction, relativeDirection);
                    var destination = Point_1.moveInDirection(this.head, direction);
                    var tileId = this.grid.getTile(destination);
                    switch (tileId) {
                        case Tile_1.Tile.Wall:
                        case this.id:
                            return this.die();
                        case Tile_1.Tile.Empty:
                            return this.move({ direction: direction, grow: false, poop: utils_1.randomChance(1 / 32) });
                        case Tile_1.Tile.Food:
                            return this.move({ direction: direction, grow: true, poop: false });
                        default:
                            if (!this.grid.wyrms[tileId]) {
                                console.warn("enemy wyrm #" + tileId + " is dead");
                                this.grid.setTile(destination, Tile_1.Tile.Empty);
                                return;
                            }
                            return this.grid.fightWyrms(this.id, tileId);
                    }
                };
                Wyrm.prototype.move = function (_a) {
                    var direction = _a.direction, grow = _a.grow, poop = _a.poop;
                    var destination = Point_1.moveInDirection(this.head, direction);
                    this.grid.setTile(destination, this.id);
                    this.segments.unshift(destination);
                    if (!grow) {
                        var last = this.segments.pop() || destination;
                        var tile = poop ? Tile_1.Tile.Food : Tile_1.Tile.Empty;
                        this.grid.setTile(last, tile);
                    }
                    this.direction = direction;
                };
                Wyrm.prototype.die = function () {
                    this.grid.destroyWyrm(this.id);
                };
                return Wyrm;
            }());
            exports_7("Wyrm", Wyrm);
        }
    };
});
System.register("Grid", ["utils", "Point", "RelativeDirection", "Tile", "Action", "Wyrm"], function (exports_8, context_8) {
    "use strict";
    var __moduleName = context_8 && context_8.id;
    var utils_2, Point_2, RelativeDirection_2, Tile_2, Action_2, Wyrm_1, tileScores, tileColors, wyrmColors, spawnInterval, Grid;
    return {
        setters: [
            function (utils_2_1) {
                utils_2 = utils_2_1;
            },
            function (Point_2_1) {
                Point_2 = Point_2_1;
            },
            function (RelativeDirection_2_1) {
                RelativeDirection_2 = RelativeDirection_2_1;
            },
            function (Tile_2_1) {
                Tile_2 = Tile_2_1;
            },
            function (Action_2_1) {
                Action_2 = Action_2_1;
            },
            function (Wyrm_1_1) {
                Wyrm_1 = Wyrm_1_1;
            }
        ],
        execute: function () {
            tileScores = [];
            tileScores[Tile_2.Tile.Empty] = 0;
            tileScores[Tile_2.Tile.Wall] = -1;
            tileScores[Tile_2.Tile.Food] = 1;
            tileColors = [];
            tileColors[Tile_2.Tile.Empty] = "#001328";
            tileColors[Tile_2.Tile.Wall] = "#feb3bf";
            tileColors[Tile_2.Tile.Food] = "#880e24";
            wyrmColors = [
                "#92e790",
                "#eafffb",
                "#54ffdb",
                "#fc2f25",
                "#f92dc7",
                "#d0f392",
                "#b5f458",
                "#e2f73a",
                "#5ec0ff",
                "#ffecaf",
                "#efe5d2",
                "#eff5a7",
                "#4fe946",
                "#9ddcff",
                "#66a37c",
                "#afebc6",
                "#fed07d",
                "#5aeb88",
                "#ffd143",
                "#38bc5e",
            ];
            spawnInterval = 64;
            Grid = (function () {
                function Grid(options) {
                    this.width = options.width;
                    this.height = options.height;
                    this.tileSize = options.tileSize;
                    this.wyrms = {};
                    this.nextWyrmId = Tile_2.Tile.Wyrm;
                    this.stepCount = 0;
                    this.tiles = new Uint8Array(this.width * this.height);
                    this.fill();
                    this.canvasElement = options.canvasElement;
                    this.context = utils_2.getRenderingContext(this.canvasElement);
                    this.setCanvasSize();
                }
                Grid.prototype.setCanvasSize = function () {
                    var pixelWidth = this.width * this.tileSize;
                    var pixelHeight = this.height * this.tileSize;
                    this.canvasElement.width = pixelWidth * this.renderScale;
                    this.canvasElement.height = pixelHeight * this.renderScale;
                    this.canvasElement.style.width = pixelWidth + "px";
                    this.canvasElement.style.height = pixelHeight + "px";
                };
                Grid.prototype.fill = function () {
                    for (var y = 0; y < this.height; y++) {
                        for (var x = 0; x < this.width; x++) {
                            var position = { x: x, y: y };
                            var tile = this.atEdge(position)
                                ? Tile_2.Tile.Wall
                                : (utils_2.randomChance(1 / 16) ? Tile_2.Tile.Food : Tile_2.Tile.Empty);
                            this.setTile(position, tile);
                        }
                    }
                };
                Grid.prototype.step = function () {
                    var _this = this;
                    if (this.stepCount > spawnInterval / 2 && this.stepCount % spawnInterval === 0) {
                        this.createRandomWyrm();
                    }
                    var wyrms = Object.keys(this.wyrms).map(function (id) { return _this.wyrms[+id]; });
                    wyrms.sort(function (wyrm) { return -wyrm.size; });
                    wyrms.forEach(function (wyrm) {
                        if (_this.wyrms[wyrm.id]) {
                            wyrm.doBestAction();
                        }
                    });
                    this.stepCount++;
                };
                Grid.prototype.draw = function () {
                    for (var x = 0; x < this.width; x++) {
                        for (var y = 0; y < this.height; y++) {
                            var position = { x: x, y: y };
                            var tile = this.getTile(position);
                            var tileColor = this.getTileColor(tile);
                            var size = this.tileSize * this.renderScale;
                            this.context.fillStyle = tileColor;
                            this.context.fillRect(x * size, y * size, size, size);
                        }
                    }
                };
                Grid.prototype.getTileColor = function (tile) {
                    var i = tile;
                    if (i < Tile_2.Tile.Wyrm) {
                        return tileColors[i];
                    }
                    i = (i - Tile_2.Tile.Wyrm) % wyrmColors.length;
                    return wyrmColors[i];
                };
                Grid.prototype.getTileScore = function (tile) {
                    var score = tileScores[tile];
                    if (score !== undefined) {
                        return score;
                    }
                    return -1;
                };
                Grid.prototype.createRandomWyrm = function () {
                    var x = Math.floor(this.width / 2);
                    var y = Math.floor(this.height / 2);
                    var position = { x: x, y: y };
                    var direction = utils_2.randomInt(0, 3);
                    this.createWyrm(position, direction);
                };
                Grid.prototype.createWyrm = function (position, direction) {
                    var currentTile = this.getTile(position);
                    if (currentTile === Tile_2.Tile.Wall || currentTile >= Tile_2.Tile.Wyrm) {
                        return;
                    }
                    var id = this.nextWyrmId++;
                    var wyrm = new Wyrm_1.Wyrm({ id: id, position: position, direction: direction, grid: this });
                    this.wyrms[id] = wyrm;
                    this.setTile(position, id);
                };
                Grid.prototype.destroyWyrm = function (id) {
                    var _this = this;
                    var wyrm = this.wyrms[id];
                    delete this.wyrms[id];
                    wyrm.segments.forEach(function (position) {
                        var tile = utils_2.randomChance(1 / 4) ? Tile_2.Tile.Empty : Tile_2.Tile.Food;
                        _this.setTile(position, tile);
                    });
                };
                Grid.prototype.fightWyrms = function (idA, idB) {
                    var wyrmA = this.wyrms[idA];
                    var wyrmB = this.wyrms[idB];
                    var ratio = wyrmA.size / wyrmB.size;
                    var advantage = utils_2.randomInt(8, 12) / 10;
                    var finalRatio = ratio * advantage;
                    var winner = wyrmA, loser = wyrmB;
                    if (finalRatio < 0.5) {
                        winner = wyrmB, loser = wyrmA;
                    }
                    loser.die();
                    winner.doAction(Action_2.Action.MoveForward);
                };
                Grid.prototype.getTile = function (position) {
                    var i = this.index(position);
                    return this.tiles[i];
                };
                Grid.prototype.getNeighbors = function (position, direction) {
                    var left = utils_2.rotateDirection(direction, RelativeDirection_2.RelativeDirection.Left);
                    var right = utils_2.rotateDirection(direction, RelativeDirection_2.RelativeDirection.Right);
                    var forwardPosition = Point_2.moveInDirection(position, direction);
                    var leftPosition = Point_2.moveInDirection(position, left);
                    var rightPosition = Point_2.moveInDirection(position, right);
                    return [
                        [RelativeDirection_2.RelativeDirection.Forward, this.getTile(forwardPosition)],
                        [RelativeDirection_2.RelativeDirection.Left, this.getTile(leftPosition)],
                        [RelativeDirection_2.RelativeDirection.Right, this.getTile(rightPosition)],
                    ];
                };
                Grid.prototype.setTile = function (position, tile) {
                    var i = this.index(position);
                    this.tiles[i] = tile;
                };
                Grid.prototype.atEdge = function (position) {
                    var x = position.x, y = position.y;
                    return y === 0 || y === this.height - 1 || x === 0 || x === this.width - 1;
                };
                Grid.prototype.index = function (position) {
                    return position.y * this.width + position.x;
                };
                Object.defineProperty(Grid.prototype, "renderScale", {
                    get: function () {
                        return window.devicePixelRatio;
                    },
                    enumerable: true,
                    configurable: true
                });
                return Grid;
            }());
            exports_8("Grid", Grid);
        }
    };
});
System.register("app", ["utils", "Grid"], function (exports_9, context_9) {
    "use strict";
    var __moduleName = context_9 && context_9.id;
    var utils_3, Grid_1, App;
    return {
        setters: [
            function (utils_3_1) {
                utils_3 = utils_3_1;
            },
            function (Grid_1_1) {
                Grid_1 = Grid_1_1;
            }
        ],
        execute: function () {
            App = (function () {
                function App() {
                    var tileSize = 8;
                    var width = Math.floor(window.innerWidth / tileSize);
                    var height = Math.floor(window.innerHeight / tileSize);
                    var canvasElement = utils_3.getElementById("canvas");
                    canvasElement.addEventListener("click", this.onClick.bind(this));
                    this.grid = new Grid_1.Grid({ width: width, height: height, tileSize: tileSize, canvasElement: canvasElement });
                    this.lastStepTime = 0;
                    this.stepInterval = 1000 / 16;
                    this.run();
                }
                App.prototype.run = function () {
                    var _this = this;
                    var update = function (currentTime) {
                        requestAnimationFrame(update);
                        var nextStepTime = _this.lastStepTime + _this.stepInterval;
                        if (currentTime >= nextStepTime) {
                            _this.lastStepTime = currentTime;
                            _this.grid.step();
                            _this.grid.draw();
                        }
                    };
                    requestAnimationFrame(update);
                };
                App.prototype.onClick = function (event) {
                    var x = Math.floor(event.offsetX / this.grid.tileSize);
                    var y = Math.floor(event.offsetY / this.grid.tileSize);
                    var position = { x: x, y: y };
                    var direction = utils_3.randomInt(0, 3);
                    this.grid.createWyrm(position, direction);
                    this.grid.step();
                };
                return App;
            }());
            exports_9("App", App);
        }
    };
});
System.register("index", ["app"], function (exports_10, context_10) {
    "use strict";
    var __moduleName = context_10 && context_10.id;
    var app_1;
    return {
        setters: [
            function (app_1_1) {
                app_1 = app_1_1;
            }
        ],
        execute: function () {
            document.addEventListener("DOMContentLoaded", function (_) {
                var app = new app_1.App();
            });
        }
    };
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJzcmMvQWN0aW9uLnRzIiwic3JjL0RpcmVjdGlvbi50cyIsInNyYy9Qb2ludC50cyIsInNyYy9SZWxhdGl2ZURpcmVjdGlvbi50cyIsInNyYy91dGlscy50cyIsInNyYy9UaWxlLnRzIiwic3JjL1d5cm0udHMiLCJzcmMvR3JpZC50cyIsInNyYy9hcHAudHMiLCJzcmMvRW50aXR5VHlwZS50cyIsInNyYy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7O1lBQUEsV0FBWSxNQUFNO2dCQUNkLGlEQUFlLENBQUE7Z0JBQ2YsMkNBQVEsQ0FBQTtnQkFDUiw2Q0FBUyxDQUFBO1lBQ2IsQ0FBQyxFQUpXLE1BQU0sS0FBTixNQUFNLFFBSWpCOzs7Ozs7Ozs7Ozs7WUNKRCxXQUFZLFNBQVM7Z0JBQ2pCLHFDQUFNLENBQUE7Z0JBQ04sMkNBQUssQ0FBQTtnQkFDTCx5Q0FBSSxDQUFBO2dCQUNKLHlDQUFJLENBQUE7WUFDUixDQUFDLEVBTFcsU0FBUyxLQUFULFNBQVMsUUFLcEI7Ozs7Ozs7O0lDRUQseUJBQWdDLEtBQVksRUFBRSxTQUFvQjtRQUM5RCxJQUFNLFFBQVEsZ0JBQVEsS0FBSyxDQUFFLENBQUM7UUFDOUIsTUFBTSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQztZQUNoQixLQUFLLHFCQUFTLENBQUMsRUFBRTtnQkFDYixRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEIsS0FBSyxDQUFDO1lBQ1YsS0FBSyxxQkFBUyxDQUFDLEtBQUs7Z0JBQ2hCLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNoQixLQUFLLENBQUM7WUFDVixLQUFLLHFCQUFTLENBQUMsSUFBSTtnQkFDZixRQUFRLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDaEIsS0FBSyxDQUFDO1lBQ1YsS0FBSyxxQkFBUyxDQUFDLElBQUk7Z0JBQ2YsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ2hCLEtBQUssQ0FBQztRQUNkLENBQUM7UUFFRCxNQUFNLENBQUMsUUFBUSxDQUFDO0lBQ3BCLENBQUM7O0lBRUQsb0JBQTJCLEtBQVksRUFBRSxLQUFhLEVBQUUsTUFBYztRQUNsRSxJQUFNLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDLEdBQUcsS0FBSyxDQUFDO1FBQ3BDLElBQU0sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsR0FBRyxNQUFNLENBQUMsR0FBRyxNQUFNLENBQUM7UUFDdEMsTUFBTSxDQUFDLEVBQUMsQ0FBQyxHQUFBLEVBQUUsQ0FBQyxHQUFBLEVBQUMsQ0FBQztJQUNsQixDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQy9CRCxXQUFZLGlCQUFpQjtnQkFDekIsK0RBQVcsQ0FBQTtnQkFDWCwyREFBSyxDQUFBO2dCQUNMLGlFQUFRLENBQUE7Z0JBQ1IseURBQUksQ0FBQTtZQUNSLENBQUMsRUFMVyxpQkFBaUIsS0FBakIsaUJBQWlCLFFBSzVCOzs7Ozs7OztJQ0FELHFDQUE0QyxTQUE0QjtRQUNwRSxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO1lBQ2hCLEtBQUsscUNBQWlCLENBQUMsT0FBTyxFQUFFLE1BQU0sQ0FBQyxlQUFNLENBQUMsV0FBVyxDQUFDO1lBQzFELEtBQUsscUNBQWlCLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxlQUFNLENBQUMsUUFBUSxDQUFDO1lBQ3BELFNBQVMsTUFBTSxDQUFDLGVBQU0sQ0FBQyxTQUFTLENBQUM7UUFDckMsQ0FBQztJQUNMLENBQUM7O0lBRUQsNkJBQW9DLE9BQW9CLEVBQUUsU0FBaUI7UUFDdkUsSUFBTSxLQUFLLEdBQUcsT0FBTyxDQUFDLHNCQUFzQixDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBZ0IsQ0FBQztRQUMxRSxFQUFFLENBQUMsQ0FBQyxLQUFLLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztZQUNqQixNQUFNLElBQUksS0FBSyxDQUFDLHVCQUFxQixTQUFTLHFCQUFrQixDQUFDLENBQUM7UUFDdEUsQ0FBQztRQUVELE1BQU0sQ0FBQyxLQUFLLENBQUM7SUFDakIsQ0FBQzs7SUFFRCx3QkFBK0IsRUFBVTtRQUNyQyxJQUFNLE9BQU8sR0FBRyxRQUFRLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzVDLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQW9CLEVBQUUscUJBQWtCLENBQUMsQ0FBQztRQUM5RCxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDOztJQUVELDZCQUFvQyxhQUFnQztRQUNoRSxJQUFNLE9BQU8sR0FBRyxhQUFhLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLE9BQU8sS0FBSyxJQUFJLENBQUMsQ0FBQyxDQUFDO1lBQ25CLE1BQU0sSUFBSSxLQUFLLENBQUMsb0NBQW9DLENBQUMsQ0FBQztRQUMxRCxDQUFDO1FBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQztJQUNuQixDQUFDOztJQUVELHNCQUE2QixDQUFTO1FBQ2xDLE1BQU0sQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQzdCLENBQUM7O0lBRUQsbUJBQTBCLEdBQVcsRUFBRSxHQUFXO1FBQzlDLElBQU0sS0FBSyxHQUFHLEdBQUcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxDQUFDO1FBQzVCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsR0FBRyxHQUFHLENBQUM7SUFDbkQsQ0FBQzs7SUFFRCxxQ0FBNEMsTUFBYztRQUN0RCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQ2IsS0FBSyxlQUFNLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxxQ0FBaUIsQ0FBQyxPQUFPLENBQUM7WUFDMUQsS0FBSyxlQUFNLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxxQ0FBaUIsQ0FBQyxJQUFJLENBQUM7WUFDcEQsS0FBSyxlQUFNLENBQUMsU0FBUyxFQUFFLE1BQU0sQ0FBQyxxQ0FBaUIsQ0FBQyxLQUFLLENBQUM7UUFDMUQsQ0FBQztJQUNMLENBQUM7O0lBRUQseUJBQWdDLFNBQW9CLEVBQUUsTUFBeUI7UUFDM0UsTUFBTSxDQUFDLENBQUMsU0FBUyxHQUFHLE1BQU0sR0FBRyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUMzREQsV0FBWSxJQUFJO2dCQUNaLGlDQUFTLENBQUE7Z0JBQ1QsK0JBQUksQ0FBQTtnQkFDSiwrQkFBSSxDQUFBO2dCQUNKLCtCQUFJLENBQUE7WUFDUixDQUFDLEVBTFcsSUFBSSxLQUFKLElBQUksUUFLZjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztZQ0dEO2dCQUFBO2dCQUtBLENBQUM7Z0JBQUQsa0JBQUM7WUFBRCxDQUFDLEFBTEQsSUFLQzs7WUFFRDtnQkFBQTtnQkFJQSxDQUFDO2dCQUFELGlCQUFDO1lBQUQsQ0FBQyxBQUpELElBSUM7O1lBRUQ7Z0JBTUksY0FBWSxPQUFvQjtvQkFDNUIsSUFBSSxDQUFDLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDO29CQUNyQixJQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUM7b0JBQ3pCLElBQUksQ0FBQyxRQUFRLEdBQUcsQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQ25DLElBQUksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLFNBQVMsQ0FBQztnQkFDdkMsQ0FBQztnQkFFRCxzQkFBSSxzQkFBSTt5QkFBUjt3QkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNLENBQUM7b0JBQ2hDLENBQUM7OzttQkFBQTtnQkFFRCxzQkFBSSxzQkFBSTt5QkFBUjt3QkFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDNUIsQ0FBQzs7O21CQUFBO2dCQUVELDJCQUFZLEdBQVo7b0JBQ0ksSUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3BFLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLENBQUMsQ0FBQztvQkFDdEQsSUFBTSxNQUFNLEdBQUcsbUNBQTJCLENBQUMsU0FBUyxDQUFDLENBQUM7b0JBQ3RELElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLENBQUM7Z0JBQzFCLENBQUM7Z0JBRU8sa0NBQW1CLEdBQTNCLFVBQTRCLFNBQXdCO29CQUFwRCxpQkFPQztvQkFORyxJQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxHQUFHLENBQUMsVUFBQyxFQUFpQjs0QkFBaEIsaUJBQVMsRUFBRSxZQUFJO3dCQUNwRCxJQUFNLEtBQUssR0FBRyxLQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQzt3QkFDM0MsTUFBTSxDQUFDLENBQUMsU0FBUyxFQUFFLEtBQUssQ0FBQyxDQUFDO29CQUM5QixDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQyxFQUFVLEVBQUUsRUFBVTs0QkFBbkIsY0FBTTs0QkFBTSxjQUFNO3dCQUFNLE9BQUEsTUFBTSxHQUFHLE1BQU07b0JBQWYsQ0FBZSxDQUFDLENBQUM7b0JBQzlDLElBQUEsa0NBQVMsQ0FBeUI7b0JBQ3pDLE1BQU0sQ0FBQyxTQUFTLENBQUM7Z0JBQ3JCLENBQUM7Z0JBRUQsdUJBQVEsR0FBUixVQUFTLE1BQWM7b0JBQ25CLElBQU0saUJBQWlCLEdBQUcsbUNBQTJCLENBQUMsTUFBTSxDQUFDLENBQUM7b0JBQzlELElBQU0sU0FBUyxHQUFHLHVCQUFlLENBQUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxpQkFBaUIsQ0FBQyxDQUFDO29CQUNyRSxJQUFNLFdBQVcsR0FBRyx1QkFBZSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBRTFELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBVyxDQUFDO29CQUN4RCxNQUFNLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO3dCQUNiLEtBQUssV0FBSSxDQUFDLElBQUksQ0FBQzt3QkFDZixLQUFLLElBQUksQ0FBQyxFQUFFOzRCQUNSLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7d0JBQ3RCLEtBQUssV0FBSSxDQUFDLEtBQUs7NEJBQ1gsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxvQkFBWSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsRUFBQyxDQUFDLENBQUM7d0JBQzNFLEtBQUssV0FBSSxDQUFDLElBQUk7NEJBQ1YsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBQyxTQUFTLFdBQUEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUMsQ0FBQyxDQUFDO3dCQUMzRDs0QkFDSSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQ0FDM0IsT0FBTyxDQUFDLElBQUksQ0FBQyxpQkFBZSxNQUFNLGFBQVUsQ0FBQyxDQUFDO2dDQUM5QyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsV0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2dDQUMzQyxNQUFNLENBQUM7NEJBQ1gsQ0FBQzs0QkFFRCxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsQ0FBQztvQkFDckQsQ0FBQztnQkFDTCxDQUFDO2dCQUVPLG1CQUFJLEdBQVosVUFBYSxFQUFxQzt3QkFBbkMsd0JBQVMsRUFBRSxjQUFJLEVBQUUsY0FBSTtvQkFDaEMsSUFBTSxXQUFXLEdBQUcsdUJBQWUsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUN4QyxJQUFJLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQztvQkFFbkMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO3dCQUNSLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLElBQUksV0FBVyxDQUFDO3dCQUNoRCxJQUFNLElBQUksR0FBRyxJQUFJLEdBQUcsV0FBSSxDQUFDLElBQUksR0FBRyxXQUFJLENBQUMsS0FBSyxDQUFDO3dCQUMzQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQ2xDLENBQUM7b0JBRUQsSUFBSSxDQUFDLFNBQVMsR0FBRyxTQUFTLENBQUM7Z0JBQy9CLENBQUM7Z0JBRUQsa0JBQUcsR0FBSDtvQkFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLENBQUM7Z0JBQ0wsV0FBQztZQUFELENBQUMsQUEvRUQsSUErRUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUN4RkssVUFBVSxHQUFlLEVBQUUsQ0FBQztZQUNsQyxVQUFVLENBQUMsV0FBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUMzQixVQUFVLENBQUMsV0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDO1lBQzNCLFVBQVUsQ0FBQyxXQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBSXBCLFVBQVUsR0FBZSxFQUFFLENBQUM7WUFDbEMsVUFBVSxDQUFDLFdBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDbkMsVUFBVSxDQUFDLFdBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7WUFDbEMsVUFBVSxDQUFDLFdBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxTQUFTLENBQUM7WUFFNUIsVUFBVSxHQUFlO2dCQUMzQixTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7Z0JBQ1QsU0FBUztnQkFDVCxTQUFTO2dCQUNULFNBQVM7YUFDWixDQUFDO1lBYUksYUFBYSxHQUFHLEVBQUUsQ0FBQztZQUV6QjtnQkFXSSxjQUFZLE9BQW9CO29CQUM1QixJQUFJLENBQUMsS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLENBQUM7b0JBQzNCLElBQUksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztvQkFDN0IsSUFBSSxDQUFDLFFBQVEsR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDO29CQUVqQyxJQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsQ0FBQztvQkFDaEIsSUFBSSxDQUFDLFVBQVUsR0FBRyxXQUFJLENBQUMsSUFBSSxDQUFDO29CQUM1QixJQUFJLENBQUMsU0FBUyxHQUFHLENBQUMsQ0FBQztvQkFFbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztvQkFDdEQsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO29CQUVaLElBQUksQ0FBQyxhQUFhLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQztvQkFDM0MsSUFBSSxDQUFDLE9BQU8sR0FBRywyQkFBbUIsQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLENBQUM7b0JBQ3ZELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztnQkFDekIsQ0FBQztnQkFFTyw0QkFBYSxHQUFyQjtvQkFDSSxJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUM7b0JBQzlDLElBQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQztvQkFDaEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEdBQUcsVUFBVSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUM7b0JBQ3pELElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxHQUFHLFdBQVcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDO29CQUMzRCxJQUFJLENBQUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQU0sVUFBVSxPQUFJLENBQUM7b0JBQ25ELElBQUksQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBTSxXQUFXLE9BQUksQ0FBQztnQkFDekQsQ0FBQztnQkFFTyxtQkFBSSxHQUFaO29CQUNJLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO3dCQUNuQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQzs0QkFDbEMsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDOzRCQUMxQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztrQ0FDNUIsV0FBSSxDQUFDLElBQUk7a0NBQ1QsQ0FBQyxvQkFBWSxDQUFDLENBQUMsR0FBRyxFQUFFLENBQUMsR0FBRyxXQUFJLENBQUMsSUFBSSxHQUFHLFdBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs0QkFDdEQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLENBQUM7d0JBQ2pDLENBQUM7b0JBQ0wsQ0FBQztnQkFDTCxDQUFDO2dCQUVELG1CQUFJLEdBQUo7b0JBQUEsaUJBY0M7b0JBYkcsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxhQUFhLEdBQUcsQ0FBQyxJQUFJLElBQUksQ0FBQyxTQUFTLEdBQUcsYUFBYSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7d0JBQzdFLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDO29CQUM1QixDQUFDO29CQUVELElBQU0sS0FBSyxHQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsQ0FBQyxVQUFBLEVBQUUsSUFBSSxPQUFBLEtBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBZixDQUFlLENBQUMsQ0FBQztvQkFDakUsS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksSUFBSSxPQUFBLENBQUMsSUFBSSxDQUFDLElBQUksRUFBVixDQUFVLENBQUMsQ0FBQztvQkFDL0IsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFBLElBQUk7d0JBQ2QsRUFBRSxDQUFDLENBQUMsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUN0QixJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7d0JBQ3hCLENBQUM7b0JBQ0wsQ0FBQyxDQUFDLENBQUM7b0JBRUgsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO2dCQUNyQixDQUFDO2dCQUVELG1CQUFJLEdBQUo7b0JBQ0ksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7d0JBQ2xDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDOzRCQUNuQyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUM7NEJBQzFCLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLENBQUM7NEJBQ3BDLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDLENBQUM7NEJBQzFDLElBQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQzs0QkFFOUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxTQUFTLEdBQUcsU0FBUyxDQUFDOzRCQUNuQyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsR0FBRyxJQUFJLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO3dCQUMxRCxDQUFDO29CQUNMLENBQUM7Z0JBQ0wsQ0FBQztnQkFFTywyQkFBWSxHQUFwQixVQUFxQixJQUFVO29CQUMzQixJQUFJLENBQUMsR0FBRyxJQUFjLENBQUM7b0JBQ3ZCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxXQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzt3QkFDaEIsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDekIsQ0FBQztvQkFFRCxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFVBQVUsQ0FBQyxNQUFNLENBQUM7b0JBQ3hDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3pCLENBQUM7Z0JBRUQsMkJBQVksR0FBWixVQUFhLElBQVU7b0JBQ25CLElBQU0sS0FBSyxHQUFHLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztvQkFDL0IsRUFBRSxDQUFDLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RCLE1BQU0sQ0FBQyxLQUFLLENBQUM7b0JBQ2pCLENBQUM7b0JBRUQsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUNkLENBQUM7Z0JBRUQsK0JBQWdCLEdBQWhCO29CQUNJLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsQ0FBQztvQkFDckMsSUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN0QyxJQUFNLFFBQVEsR0FBRyxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUMsR0FBQSxFQUFFLENBQUM7b0JBQzFCLElBQU0sU0FBUyxHQUFHLGlCQUFTLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBYyxDQUFDO29CQUMvQyxJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsRUFBRSxTQUFTLENBQUMsQ0FBQztnQkFDekMsQ0FBQztnQkFFRCx5QkFBVSxHQUFWLFVBQVcsUUFBZSxFQUFFLFNBQW9CO29CQUM1QyxJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUMzQyxFQUFFLENBQUMsQ0FBQyxXQUFXLEtBQUssV0FBSSxDQUFDLElBQUksSUFBSSxXQUFXLElBQUksV0FBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUM7d0JBQ3hELE1BQU0sQ0FBQztvQkFDWCxDQUFDO29CQUVELElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztvQkFDN0IsSUFBTSxJQUFJLEdBQUcsSUFBSSxXQUFJLENBQUMsRUFBRSxFQUFFLElBQUEsRUFBRSxRQUFRLFVBQUEsRUFBRSxTQUFTLFdBQUEsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztvQkFDL0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQyxDQUFDO2dCQUMvQixDQUFDO2dCQUVELDBCQUFXLEdBQVgsVUFBWSxFQUFVO29CQUF0QixpQkFRQztvQkFQRyxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxDQUFDO29CQUM1QixPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLENBQUM7b0JBRXRCLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLFVBQUEsUUFBUTt3QkFDMUIsSUFBTSxJQUFJLEdBQUcsb0JBQVksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsV0FBSSxDQUFDLEtBQUssR0FBRyxXQUFJLENBQUMsSUFBSSxDQUFDO3dCQUMxRCxLQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztvQkFDakMsQ0FBQyxDQUFDLENBQUM7Z0JBQ1AsQ0FBQztnQkFFRCx5QkFBVSxHQUFWLFVBQVcsR0FBVyxFQUFFLEdBQVc7b0JBQy9CLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzlCLElBQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7b0JBQzlCLElBQU0sS0FBSyxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQztvQkFDdEMsSUFBTSxTQUFTLEdBQUcsaUJBQVMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLEdBQUcsRUFBRSxDQUFDO29CQUN4QyxJQUFNLFVBQVUsR0FBRyxLQUFLLEdBQUcsU0FBUyxDQUFDO29CQUVyQyxJQUFJLE1BQU0sR0FBRyxLQUFLLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbEMsRUFBRSxDQUFDLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxDQUFDLENBQUM7d0JBQ25CLE1BQU0sR0FBRyxLQUFLLEVBQUUsS0FBSyxHQUFHLEtBQUssQ0FBQztvQkFDbEMsQ0FBQztvQkFFRCxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7b0JBQ1osTUFBTSxDQUFDLFFBQVEsQ0FBQyxlQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7Z0JBQ3hDLENBQUM7Z0JBRUQsc0JBQU8sR0FBUCxVQUFRLFFBQWU7b0JBQ25CLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQy9CLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUN6QixDQUFDO2dCQUVELDJCQUFZLEdBQVosVUFBYSxRQUFlLEVBQUUsU0FBb0I7b0JBQzlDLElBQU0sSUFBSSxHQUFHLHVCQUFlLENBQUMsU0FBUyxFQUFFLHFDQUFpQixDQUFDLElBQUksQ0FBQyxDQUFDO29CQUNoRSxJQUFNLEtBQUssR0FBRyx1QkFBZSxDQUFDLFNBQVMsRUFBRSxxQ0FBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQztvQkFDbEUsSUFBTSxlQUFlLEdBQUcsdUJBQWUsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUFDLENBQUM7b0JBQzdELElBQU0sWUFBWSxHQUFHLHVCQUFlLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO29CQUNyRCxJQUFNLGFBQWEsR0FBRyx1QkFBZSxDQUFDLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQztvQkFDdkQsTUFBTSxDQUFDO3dCQUNILENBQUMscUNBQWlCLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUM7d0JBQzFELENBQUMscUNBQWlCLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7d0JBQ3BELENBQUMscUNBQWlCLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7cUJBQ3pELENBQUM7Z0JBQ04sQ0FBQztnQkFFRCxzQkFBTyxHQUFQLFVBQVEsUUFBZSxFQUFFLElBQVU7b0JBQy9CLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7b0JBQy9CLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUN6QixDQUFDO2dCQUVPLHFCQUFNLEdBQWQsVUFBZSxRQUFlO29CQUNsQixJQUFBLGNBQUMsRUFBRSxjQUFDLENBQWM7b0JBQzFCLE1BQU0sQ0FBQyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsTUFBTSxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQztnQkFDL0UsQ0FBQztnQkFFTyxvQkFBSyxHQUFiLFVBQWMsUUFBZTtvQkFDekIsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLEtBQUssR0FBRyxRQUFRLENBQUMsQ0FBQyxDQUFDO2dCQUNoRCxDQUFDO2dCQUVELHNCQUFZLDZCQUFXO3lCQUF2Qjt3QkFDSSxNQUFNLENBQUMsTUFBTSxDQUFDLGdCQUFnQixDQUFDO29CQUNuQyxDQUFDOzs7bUJBQUE7Z0JBQ0wsV0FBQztZQUFELENBQUMsQUFuTEQsSUFtTEM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUMzT0Q7Z0JBS0k7b0JBQ0ksSUFBTSxRQUFRLEdBQUcsQ0FBQyxDQUFDO29CQUNuQixJQUFNLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUM7b0JBQ3ZELElBQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFdBQVcsR0FBRyxRQUFRLENBQUMsQ0FBQztvQkFDekQsSUFBTSxhQUFhLEdBQUcsc0JBQWMsQ0FBQyxRQUFRLENBQXNCLENBQUM7b0JBQ3BFLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFFakUsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFdBQUksQ0FBQyxFQUFDLEtBQUssT0FBQSxFQUFFLE1BQU0sUUFBQSxFQUFFLFFBQVEsVUFBQSxFQUFFLGFBQWEsZUFBQSxFQUFDLENBQUMsQ0FBQztvQkFDL0QsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUM7b0JBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxHQUFHLEVBQUUsQ0FBQztvQkFDOUIsSUFBSSxDQUFDLEdBQUcsRUFBRSxDQUFDO2dCQUNmLENBQUM7Z0JBRU8saUJBQUcsR0FBWDtvQkFBQSxpQkFhQztvQkFaRyxJQUFJLE1BQU0sR0FBRyxVQUFDLFdBQW1CO3dCQUM3QixxQkFBcUIsQ0FBQyxNQUFNLENBQUMsQ0FBQzt3QkFFOUIsSUFBTSxZQUFZLEdBQUcsS0FBSSxDQUFDLFlBQVksR0FBRyxLQUFJLENBQUMsWUFBWSxDQUFDO3dCQUMzRCxFQUFFLENBQUMsQ0FBQyxXQUFXLElBQUksWUFBWSxDQUFDLENBQUMsQ0FBQzs0QkFDOUIsS0FBSSxDQUFDLFlBQVksR0FBRyxXQUFXLENBQUM7NEJBQ2hDLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7NEJBQ2pCLEtBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7d0JBQ3JCLENBQUM7b0JBQ0wsQ0FBQyxDQUFDO29CQUVGLHFCQUFxQixDQUFDLE1BQU0sQ0FBQyxDQUFDO2dCQUNsQyxDQUFDO2dCQUVPLHFCQUFPLEdBQWYsVUFBZ0IsS0FBaUI7b0JBQzdCLElBQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDO29CQUN6RCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztvQkFDekQsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDLEdBQUEsRUFBRSxDQUFDO29CQUMxQixJQUFNLFNBQVMsR0FBRyxpQkFBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQWMsQ0FBQztvQkFDL0MsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDO29CQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNyQixDQUFDO2dCQUNMLFVBQUM7WUFBRCxDQUFDLEFBekNELElBeUNDOzs7Ozs7Ozs7Ozs7Ozs7O1lFM0NELFFBQVEsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsRUFBRSxVQUFBLENBQUM7Z0JBQzNDLElBQU0sR0FBRyxHQUFHLElBQUksU0FBRyxFQUFFLENBQUM7WUFDMUIsQ0FBQyxDQUFDLENBQUMifQ==