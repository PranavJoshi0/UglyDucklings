/*
To make sure the search terminates, we must add a cutoff at some depth. We can use the same code for this
search as for breadth-first search, if we add a depth parameter to keep track of each node’s depth.
For geometric pathfinding, we can add two enhancements. One would be to label each tile with the length 
of the cheapest path found to it yet; the algorithm would then never visit it again unless it had a 
cheaper path, or one just as cheap but searching to a greater depth.
Iterative-deepening depth-first search : A technique that carries out a depth-first search with 
increasing depth: first one, then two, and so on until the goal is found. We can enhance this by starting 
with a depth equal to the straight-line distance from the start to the goal. This search is 
asymptotically optimal among brute force searches in both space and time.
*/

class IDDepthFirstSearch
{
    constructor(options)
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

    pathFinder(startX, startY, endX, endY, activeGrid)
    {
        var graph = activeGrid.graph,
            start = graph.getNodeAt(startX, startY),
            end = graph.getNodeAt(endX, endY),
            diagOption = this.diagonalOption,
            depth = diagOption === DiagonalOptions.Never ? 
                    Heuristic.Manhattan(Math.abs(startX - endX), Math.abs(startY - endY)) : 
                    Heuristic.Octile(Math.abs(startX - endX), Math.abs(startY -  endY)),
            maxDepth = graph.rowCount * graph.columnCount,
            foundDest = false;

        var DLS = function(start, graph, depthLimit)
        {
            //var box = activeGrid.getBox(start.y, start.x);
    
            //start.isVisited = true;
    
            if(start === end)
            {
                return true;
            }
    
            else
            {
                start.isVisited = true;
            }
    
            if(depthLimit <= 0)
            {
                return false;
            }
    
            var neighbors = graph.getNeighbors(start.x, start.y, diagOption), i;
    
            for(i = 0; i < neighbors.length; i++)
            {
                var neighbor = neighbors[i],
                    isDiag = false;
            
                if(neighbor.x !== start.x && neighbor.y !== start.y)
                {
                    isDiag = true;
                }
            
                var val = (neighbor.weight + start.weight) / 2.0,
                    newDist = start.dist + isDiag ? Math.SQRT2 * val : val;
    
                if(neighbor.isVisited && newDist < neighbor.dist)
                {
                    neighbor.parent = start;
                    neighbor.dist = newDist;
                    neighbor.isVisited = false;
                }
            
                if(!neighbor.isVisited)
                {
                    neighbor.setAsTraversed();//Animate.setTraversed(neighbor);
                    neighbor.parent = start;
                    neighbor.dist = newDist;
    
                    if(DLS(neighbor, graph, depthLimit - 1) === true)
                    {
                        return true;
                    }
                }
            }
            return false;
        };

        for (;depth <= maxDepth; depth++) 
        {
            activeGrid.resetTraversal();
            if (DLS(start, graph, depth) === true)
            {
                foundDest = true;
                break;
            }
        }
  
        if(foundDest === true)
        {
            var p = new Path();
            p.traceFromEnd(end);
            return(p.path);
        }

        else
        {
            return [];
        }
    }
};