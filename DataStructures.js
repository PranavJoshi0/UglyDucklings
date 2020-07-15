class MinHeap
{
    constructor()
    {
        this.elements = [];
    }

    insert(elem)
    {
        this.elements.push(elem);
        this.bubbleUp(this.elements.length - 1); 
    }

    bubbleUp(index)
    {
        while (index > 0)
        {
            //console.log(index);
            //console.log("........");
            //console.log(this.elements.length);
            // get the parent
            var parent = Math.floor((index + 1) / 2) - 1;
            
            // if parent is greater than child
            if (this.elements[parent].f > this.elements[index].f)
            {
              // swap
              var temp = this.elements[parent];
              this.elements[parent] = this.elements[index];
              this.elements[index] = temp;
            }
            
            index = parent;
        }
    }

    /*getMin()
    {
        return(this.elements[0]);
    }*/

    popMin()
    {
        var min = this.elements[0],
            l = this.elements.length,
            index = 0;

        this.elements[0] = this.elements[l - 1];
        this.elements[l - 1] = min;
        min = this.elements.pop();

        while(true)
        {
            var child = 2 * (index + 1), swap;

            if(this.elements[child] == null && this.elements[child - 1] == null)
            {
                break;
            }

            else if(this.elements[child] == null || this.elements[child].f > this.elements[child - 1].f)
            {
                swap = child - 1;
            }

            else
            {
                swap = child;
            }
            
            if(this.elements[index].f > this.elements[swap].f)
            {
                var temp = this.elements[index];
                this.elements[index] = this.elements[swap];
                this.elements[swap] = temp;
                index = swap;
            }
            else
            {
                break;
            }
        }

        return(min);
    }

    isEmpty()
    {
        return(this.elements.length === 0);
    }

    decreaseKey(fNew, x, y)
    {
        var i;
        
        for(i = 0; i < this.elements.length; i++)
        {
            if(this.elements[i].coord[0] === x && 
               this.elements[i].coord[1] === y &&
               this.elements[i].f > fNew)
            {
                this.elements[i].f = fNew;
                this.bubbleUp(i);
                break;
            }
        }
    }
};

class Queue
{
    constructor()
    {
        this.queue  = [];
        this.startingpt = 0;
    }

    getLength()
    {
        return (this.queue.length - this.startingpt);
    }
    
    isEmpty()
    {
        return (this.queue.length == 0);
    }
    
    enqueue(item)
    {
        this.queue.push(item);
    }
    
    dequeue()
    {
        if (this.queue.length == 0)
        {
            return undefined;
        }
        
        var item = this.queue[this.startingpt];
        
        if (++this.startingpt * 2 >= this.queue.length)
        {
            this.queue  = this.queue.slice(this.startingpt);
            this.startingpt = 0;
        }
        
        return item;
    }

    peek()
    {
        return (this.queue.length > 0 ? this.queue[this.startingpt] : undefined);
    }
}

/*
openList = new MinHeap();
openList.insert({f: 0, coord: [4,5]});
openList.insert({f: 1, coord: [4,3]});

openList.insert({f: 5, coord: [2,5]});
openList.insert({f: 3, coord: [3,5]});
openList.insert({f: 8, coord: [6,5]});
openList.insert({f: 4, coord: [4,8]});
openList.insert({f: 2, coord: [4,9]});
console.log(openList);
console.log(openList.popMin());
console.log(openList);
console.log(openList.popMin());
console.log(openList);
console.log(openList.popMin());
console.log(openList);
console.log(openList.popMin());
console.log(openList);
console.log(openList.popMin());
console.log(openList);
console.log(openList.popMin());
console.log(openList);
console.log(openList.popMin());
console.log(openList);*/

//module.exports = MinHeap;