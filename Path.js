class Path
{
    constructor()
    {
        this.path = [];
    }
    
    traceFromEnd(end)
    {
        var path = [],
            node = end;
    
        path.push([end.x, end.y]);

        while (node.parent)
        {
            node = node.parent;
            path.push([node.x, node.y]);
        }
    
        this.path = path.reverse();
    }
};
//module.exports = Path;
