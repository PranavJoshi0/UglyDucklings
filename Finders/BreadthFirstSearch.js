//var Path = require('./Path');
//var DiagonalOptions = require('./DiagonalOptions');

//for unweighted graphs

function BreadthFirstSearch(options)
{
    options = options || {};
    
    if(!options.allowDiagonal)
    {
        this.diagonalOption = DiagonalOptions.Never;
    }

    else if(options.dontCrossCorners)
    {
        this.diagonalOption = DiagonalOptions.noNeighborBlocked;
    }

    else
    {
        this.diagonalOption = DiagonalOptions.oneNeighborBlocked;
    }
}

BreadthFirstSearch.prototype.pathFinder = function(startX, startY, endX, endY, graph)
{
    var openList = [],
        start = graph.getNodeAt(startX, startY),
        end = graph.getNodeAt(endX, endY),
        diagOption = this.diagonalOption,
        neighbors = [];

    start.isVisited = true;
    openList.push(start);

    while (openList.length)
    {
        var node = openList.shift();
            //box = graph.getBox(node.y, node.x);

        if (end.x == node.x && end.y == node.y)
        {   
            end.setAsEnd();
            var p = new Path();
            p.traceFromEnd(end);
            return(p.path);
        }

        else
        {
            node.isVisited = true;
        }

        neighbors = graph.getNeighbors(node.x, node.y, diagOption);
        for (var i = 0, l = neighbors.length; i < neighbors.length; ++i)
        {
            if (!neighbors[i].isVisited)
            {
                neighbors[i].isVisited = true;
                neighbors[i].parent = node;
                if(neighbors[i].nodeType != states.BOX_TYPES.END_NODE)
                neighbors[i].setAsTraversed();
                openList.push(neighbors[i]);
            }
        }
    }

    return [];
};

