//var MinHeap = require('./MinHeap');
//var Path = require('./Path');
//var Heuristic = require('./Heuristic');
//var DiagonalOptions = require('./DiagonalOptions');

class AStar
{
    constructor(options){
    options = options || {};

    //this.heuristic = opt.heuristic || Heuristic.Manhattan;
    
    if (!options.allowDiagonal)
    {
        this.diagonalOption = DiagonalOptions.Never;
        this.heuristic = options.heuristic || Heuristic.Manhattan;
    }
    
    else 
    {
        this.heuristic = options.heuristic || Heuristic.Octile;
        if (options.dontCrossCorners)
        {
            this.diagonalOption = DiagonalOptions.noNeighborBlocked;
        }
    
        else
        {
            this.diagonalOption = DiagonalOptions.oneNeighborBlocked;
        }
    }
}

pathFinder(startX, startY, endX, endY, graph, algo = 'a-star', color = true)
{
    //graph.resetTraversal();

    var start = graph.getNodeAt(startX, startY),
        end = graph.getNodeAt(endX, endY),
        diagOption = this.diagonalOption,
        heuristic = this.heuristic,
        closedList = [],
        openList = new MinHeap();

    for(var i = 0; i < graph.rowCount; ++i)
    {
        var temp = [];//closedList[i] = new Array(graph.columnCount);
        for(var j = 0; j < graph.columnCount; ++j)
        {
            temp.push(false);//closedList[i][j] = false;
        }
        //console.log(temp);
        closedList.push(temp);
    }

    //console.log(closedList);

    //initializing f, g, h for the start node
    openList.insert({f : 0, coord : [startX, startY]});
    start.isVisited = true;
    start.g = start.h = start.f = 0;
    start.parent = null;

    while(!openList.isEmpty())
    {
        var minElement = openList.popMin(),
            currentX = minElement.coord[0],
            currentY = minElement.coord[1],
            currentNode = graph.getNodeAt(currentX, currentY),
            neighbors = graph.getNeighbors(currentX, currentY, diagOption),
            neighbor, i, gNew, hNew, fNew;

        console.log("MinPopped");
        console.log(minElement);

        closedList[currentY][currentX] = true;

        for(i = 0; i < neighbors.length; ++i)
        {
            neighbor = neighbors[i];

            if(neighbor.x == end.x && neighbor.y == end.y)
            {
                neighbor.parent = currentNode;
                var p = new Path();
                p.traceFromEnd(end);
                return(p.path);
            }

            var isDiag = false;

            if(neighbor.x !== currentX && neighbor.y !== currentY)
            {
                isDiag = true;
            }
            
            if(!closedList[neighbor.y][neighbor.x])
            {
                var val = (neighbor.weight + currentNode.weight) / 2.0;
                gNew = algo === 'best-first-search' ? 0 : currentNode.g + (isDiag ? Math.SQRT2 * val : val);
                hNew = algo === 'dijkstra' ? 0 : heuristic(Math.abs(end.x - neighbor.x), Math.abs(end.y - neighbor.y));
                fNew = gNew + hNew;

                if(neighbor.isVisited)
                {    
                    if(neighbor.g > gNew)
                    {
                        openList.decreaseKey(fNew, neighbor.x, neighbor.y);
                        neighbor.f = fNew;
                        neighbor.g = gNew;
                        neighbor.h = hNew;
                        neighbor.parent = currentNode;
                    }
                }

                if(!neighbor.isVisited)
                {
                    //var box = graph.getBox(neighbor.y, neighbor.x);
                    openList.insert({f : fNew, coord : [neighbor.x, neighbor.y]});
                    neighbor.isVisited = true;
                    if(color === true) //color the node only when we want to show the search
                    {
                        neighbor.setAsTraversed();
                    }
                    neighbor.f = fNew;
                    neighbor.g = gNew;
                    neighbor.h = hNew;
                    neighbor.parent = currentNode;
                }
            }
        }
    }
    return [];
}};

//module.exports = AStar;