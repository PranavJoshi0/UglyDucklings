class Runner
{
    constructor(activeGrid)
    {
        this.finder = null;
        this.finderName = null;
        this.grid = activeGrid;
        this.path = [];
        this.timer = null;
        this.fixedTimer = null;
        this.FREE = true;
        this.count = 0;
        this.__speed = 0; // 0 = Max Speed
        this.onStop = null;
        this.onStart = null;
        this.onFrame = null;
        this.__startTime = null;
        this.__endTime = null;
        this.onRunnerStop = () => {};
        this.onRunnerStart = () => {};
        //this.__runnerSpeed = states.RunnerSpeeds.Fast;
        this.Heuristic = {
            //when we can move only in 4 directions (N, S, E, W)
          
            Manhattan: function(dx, dy)
            {
              return dx + dy;
            },
          
            Chebyshev: function(dx, dy)
            {
              return Math.max(dx, dy);
            },
          
            //when we can move in any of the 8 directions
          
            Euclidean: function(dx, dy)
            {
              return Math.sqrt(dx * dx + dy * dy);
            },
          
            Octile: function(dx, dy)
            {
              var root2 = Math.SQRT2;
              return Math.max(dx, dy) + (root2 - 1) * Math.min(dx, dy);
            }
        };
    }

    resetStartEnd()
    {
        this.grid.__start_node = this.grid.getBox(this.grid.startNode.y, this.grid.startNode.x);
        this.grid.setStart();
        this.grid.__end_node = this.grid.getBox(this.grid.endNode.y, this.grid.endNode.x);
        this.grid.setEnd();
    }

    setDefaultStartEnd()
    {
        this.grid.__start_node = this.grid.getBox(states.DEFAULT_POS.START_Y, states.DEFAULT_POS.START_X);
        this.grid.setStart();
        this.grid.__end_node = this.grid.getBox(states.DEFAULT_POS.END_Y, states.DEFAULT_POS.END_X);
        this.grid.setEnd();
    }

    getAlgo()
    {
        const algo = $('a[aria-expanded="true"]').data("algo");

        var allowDiagonal, dontCrossCorners, heuristic, biDirectional, maxCost = 0;
              
        switch (algo)
        {
            case 'aStar':
                allowDiagonal = typeof $('#a_star_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#a_star_list ' +
                                         '.bi-directional:checked').val() !=='undefined';
                dontCrossCorners = typeof $('#a_star_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';

                /* parseInt returns NaN (which is falsy) if the string can't be parsed
                weight = parseInt($('#astar_section .spinner').val()) || 1;
                weight = weight >= 1 ? weight : 1; if negative or 0, use 1 */

                heuristic = $('input[name=a_star_heuristic]:checked').val();
                if (biDirectional)
                {
                    finder = new states.Runners['biAStar']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic],
                    });
                    this.finderName = "Bi-Directional A-Star";
                }
                    
                else
                {
                    this.finder = new states.Runners['aStar']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic],
                    });
                    this.finderName = "A-Star";
                }
                break;

            case 'idAStar':
                allowDiagonal = typeof $('#ida_star_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#ida_star_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                /*trackRecursion = typeof $('#ida_star_list ' +
                                         '.track_recursion:checked').val() !== 'undefined';*/

                heuristic = $('input[name=jump_point_heuristic]:checked').val();

                /*weight = parseInt($('#ida_section input[name=astar_weight]').val()) || 1;
                weight = weight >= 1 ? weight : 1; if negative or 0, use 1 

                timeLimit = parseInt($('#ida_section input[name=time_limit]').val());

                // Any non-negative integer, indicates "forever".
                timeLimit = (timeLimit <= 0 || isNaN(timeLimit)) ? -1 : timeLimit;*/

                this.finder = new states.Runners['idAStar']({
                    /*timeLimit: timeLimit,
                    trackRecursion: trackRecursion,*/
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                });

                this.finderName = "IDA-Star";

                break;

            case 'bfs':
                allowDiagonal = typeof $('#bfs_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#bfs_list ' +
                                         '.bi-directional:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#bfs_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                if (biDirectional)
                {
                    finder = new states.Runners['biBFS']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Bi-Directional Breadth First Search";
                }
                    
                else
                {
                    this.finder = new states.Runners['bfs']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Breadth First Search";
                }
                break;

            case 'idDepthFirst':
                allowDiagonal = typeof $('#iddfs_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#iddfs_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                /*trackRecursion = typeof $('#iddfs_list ' +
                                         '.track_recursion:checked').val() !== 'undefined';*/

                heuristic = $('input[name=jump_point_heuristic]:checked').val();

                /*weight = parseInt($('#iddepth_first_section input[name=astar_weight]').val()) || 1;
                weight = weight >= 1 ? weight : 1; if negative or 0, use 1 

                timeLimit = parseInt($('#iddepth_first_section input[name=time_limit]').val());
 
                // Any non-negative integer, indicates "forever".
                timeLimit = (timeLimit <= 0 || isNaN(timeLimit)) ? -1 : timeLimit;*/

                this.finder = new states.Runners['idDepthFirst']({
                    /*timeLimit: timeLimit,
                    trackRecursion: trackRecursion,*/
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                });

                this.finderName = "IDDepth First Search";

                break;

            case 'bestFirst':
                allowDiagonal = typeof $('#best_first_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#best_first_list ' +
                                         '.bi-directional:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#best_first_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
            
                heuristic = $('input[name=bestfirst_heuristic]:checked').val();
                
                if (biDirectional)
                {
                    finder = new states.Runners['biBestFirst']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic]
                    });

                    this.finderName = "Bi-Directional Best First Search";
                }
                    
                else
                {
                    this.finder = new states.Runners['bestFirst']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners,
                        heuristic: this.Heuristic[heuristic]
                    });

                    this.finderName = "Best First Search";
                }
                break;

            case 'dijkstra':
                allowDiagonal = typeof $('#dijkstra_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                biDirectional = typeof $('#dijkstra_list ' +
                                         '.bi-directional:checked').val() !=='undefined';
                dontCrossCorners = typeof $('#dijkstra_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                  
                if (biDirectional)
                {
                    finder = new states.Runners['biDijkstra']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Bi-Directional Dijkstra";
                }
                    
                else
                {
                    this.finder = new states.Runners['dijkstra']({
                        allowDiagonal: allowDiagonal,
                        dontCrossCorners: dontCrossCorners
                    });

                    this.finderName = "Dijkstra";
                }
                break;

            /*case 'jps':
                trackRecursion = typeof $('#jump_point_section ' +
                                          '.track_recursion:checked').val() !== 'undefined';
                heuristic = $('input[name=jump_point_heuristic]:checked').val();
        
                finder = new states.Runners['jps']({
                    trackJumpRecursion: trackRecursion,
                    heuristic: this.Heuristic[heuristic],
                    allowDiagonal: true,
                    dontCrossCorners: false
                });

                this.finderName = "Jump Point Search";

                break;
        
            case 'ortho-jps':
                trackRecursion = typeof $('#orth_jump_point_section ' +
                                          '.track_recursion:checked').val() !== 'undefined';
                heuristic = $('input[name=orth_jump_point_heuristic]:checked').val();

                finder = new states.Runners['orthoJps']({
                    trackJumpRecursion: trackRecursion,
                    heuristic: this.Heuristic[heuristic],
                    allowDiagonal: false
                });

                this.finderName = "Orthogonal Jump Point Search";

                break;*/
          
            case 'multiStop':
                allowDiagonal = typeof $('#multi_stop_list ' +
                                         '.allow_diagonal:checked').val() !== 'undefined';
                dontCrossCorners = typeof $('#multi_stop_list ' +
                                         '.dont_cross_corners:checked').val() !=='undefined';
                    
                heuristic = $('input[name=multistop_heuristic]:checked').val();

                maxCost = parseInt($('#multi_stop_list input[name=max_cost]').val()) || Infinity;
                maxCost = maxCost >= 0 ? maxCost : Infinity;

                //timeLimit = parseInt($('#multi_stop_list input[name=time_limit]').val());

                // Any non-negative integer, indicates "forever".
                //timeLimit = (timeLimit <= 0 || isNaN(timeLimit)) ? -1 : timeLimit;*/
  
                this.finder = new states.Runners['multiStop']({
                    /*timeLimit: timeLimit,*/
                    allowDiagonal: allowDiagonal,
                    dontCrossCorners: dontCrossCorners,
                    heuristic: this.Heuristic[heuristic],
                    maxCost: maxCost
                });

                this.finderName = "Multiple Stops";

                break;
        }

        //console.log("allowDiagonal" + allowDiagonal + " dontCrossCorners" + dontCrossCorners + " heuristic" + heuristic + " biDirectional" + biDirectional);
    }

    mapPath(path)
    {
        this.path = [];
        for(var i = 0; i < path.length; i++)
        {
            var box = this.grid.getBox(path[i][1], path[i][0]);
            this.path.push(box);
        }

        this.grid.endNode.changeText(this.path.length);
        this.count = this.path.length;
    }

    runAlgo()
    {
        console.log("Running..."+this.finderName);
        var start = this.grid.startNode,
            end = this.grid.endNode,
            path = [];
        
        if(this.finder instanceof AStar)
        {
            var algoName = this.finderName === "Best First Search" ? 'best-first-search' :
                           (this.finderName === "Dijkstra" ? 'dijkstra' : 'a-star');
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid.graph, algoName, true);
        }

        else if(this.finder instanceof IDDepthFirstSearch)
        {
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid);
        }

        else if(this.finder instanceof MultipleStops)
        {
            path = this.finder.pathFinder(this.grid);
        }

        else
        {
            path = this.finder.pathFinder(start.x, start.y, end.x, end.y, this.grid.graph);
        }
        this.done();
        this.mapPath(path);
        this.resetStartEnd();
    }

    init()
    {
        this.grid.fixGrid();
        this.onStop = this.onRunnerStop();
        this.FREE = false;
        this.__startTime = new Date().getTime();
        this.runAlgo();
        if (this.FREE)
        {
            this.fixedRecall();
            return;
        }
    }
    
    fixedRecall()
    {
        if (!this.count)
        {
            this.onStop ? this.onStop() : null;
        }
        
        var i = this.count > states.MAX_FIXED_FRAME_COUNT ? 
            states.MAX_FIXED_FRAME_COUNT : 
            this.count;
        this.path.shift();
        
        this.fixedTimer = setInterval(() => {
            if (i > 1)
            {
                var node = this.path.shift();
                node.setAsPath();
                i--;
            }
            
            else
            {
                clearInterval(this.fixedTimer);
                this.fixedTimer = null;
                this.onStop ? this.onStop() : null;
            }
        }, this.__speed);
    }

    perform(r, c)
    {
        var box = this.grid.getBox(r, c);

        if(box == this.grid.startNode)
        {
            this.resetGrid();
            this.grid.actionMode = states.TOOL_MODE.START_NODE;
        }

        else if(box == this.grid.endNode)
        {
            this.resetGrid();
            this.grid.actionMode = states.TOOL_MODE.TARGET_NODE;
        }

        if (!this.running) {
            switch (this.grid.__action_mode)
            {
                case states.TOOL_MODE.START_NODE:
                    if (box != this.grid.endNode)
                    {
                        this.grid.__start_node = box;
                        this.grid.setStart();
                    }
                    break;
            
                case states.TOOL_MODE.TARGET_NODE:
                    if (box != this.grid.startNode)
                    {
                        this.grid.__end_node = box;
                        this.grid.setEnd();
                    }
                    break;
            
                case states.TOOL_MODE.WALL_NODES:
                    if (box == this.grid.__start_node ||
                        box == this.grid.__end_node ||
                        box.nodeType == states.BOX_TYPES.TRAVERSED_NODE ||
                        box.nodeType == states.BOX_TYPES.PATH_NODE)
                    {
                        return;
                    }
              
                    if (box.nodeType == states.BOX_TYPES.BLOCK)
                    {
                        this.grid.setClear(r, c);
                    }
                    
                    else
                    {
                        this.grid.setBlock(r, c);
                    }
                    
                    break;
            }
        }
    }

    addEvents(box, r, c)
    {
        var grid = this.grid,
            self = this;
        box.path.onMouseEnter = function(e) {
            if (grid.__dragEnabled)
            {
                self.perform(r, c);
            }
        };
    
        box.path.onMouseDown = function(event) {
            event.preventDefault();
            grid.__dragEnabled = true;
            self.perform(r, c);
        };
        box.path.onMouseUp = function(event) {
            grid.__dragEnabled = false;
        };
    }

    paintGrid()
    {
        var sideLength = this.grid.boxSize || this.grid.getBoxSideLength();
        for (var r = 0; r < this.grid.graph.rowCount; r++)
        {
            for (var c = 0; c < this.grid.graph.columnCount; c++)
            {
                var node = this.grid.graph.gridOfNodes[r][c];
                var x1 = sideLength * c;
                var y1 = sideLength * r;
                var x2 = x1 + sideLength;
                var y2 = y1 + sideLength;
    
                node.setPoints(new Point(x1, y1), new Point(x2, y2));
                node.draw();
                this.addEvents(node, r, c);
            }
        }
    
        this.finder = new AStar({
            allowDiagonal: true,
            dontCrossCorners: false,
            heuristic: this.Heuristic.Octile()
        });

        this.setDefaultStartEnd();
    }

    resetGrid()
    {
        if(this.FREE)
        {
            this.grid.resetTraversal();
            const sn = this.grid.startNode;
            const en = this.grid.endNode;
            sn ? sn.resetText() : null;
            en ? en.resetText() : null;
            this.resetStartEnd();
        }
    }

    clearGrid()
    {
        if(this.FREE)
        {
            this.grid.graph.resetDefault();
            for (var r = 0; r < this.grid.graph.rowCount; r++)
            {
                for (var c = 0; c < this.grid.graph.columnCount; c++)
                {
                if(this.grid.graph.gridOfNodes[r][c].nodeType !== states.BOX_TYPES.START_NODE ||
                    this.grid.graph.gridOfNodes[r][c].nodeType !== states.BOX_TYPES.END_NODE)
                    this.grid.setClear(r, c);
                }
            }
            states.Context.Runner.setDefaultStartEnd();
        }
    }

    resume()
    {
        this.FREE = false;
        this.recall();
    }
    
    done()
    {
        this.FREE = true;
        this.stop();
    }
    
    stop()
    {
        clearTimeout(this.timer);
        this.timer = null;
        this.__endTime = new Date().getTime();
        this.onStop ? this.onStop() : null;
    }

    set speed(speed)
    {
        this.__speed = speed;
    }

    get running()
    {
        return this.timer != null || this.fixedTimer != null ? true : false;
    }

    get speed()
    {
        return this.__speed;
    }
    
    get duration()
    {
        return this.FREE ? this.__endTime - this.__startTime : 0;
    }
};