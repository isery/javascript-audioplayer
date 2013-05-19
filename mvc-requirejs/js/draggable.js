define(['jQuery'], function($) {
var MakeListDraggable = function(element) {
    this.cols = document.querySelectorAll(element);
    var that = this;
    console.log('element');
    
    console.log('element');
    this.dragSrcEl = null;
   [].forEach.call(this.cols, function(col) {
        console.log(col);
        col.addEventListener('dragstart', that.handleDragStart.bind(that), false);
        col.addEventListener('dragenter', that.handleDragEnter.bind(that), false)
        col.addEventListener('dragover', that.handleDragOver.bind(that), false);
        col.addEventListener('dragleave', that.handleDragLeave.bind(that), false);
        col.addEventListener('drop', that.handleDrop.bind(that), false);
        col.addEventListener('dragend', that.handleDragEnd.bind(that), false);
    });
};

MakeListDraggable.prototype.handleDragEnd = function(e) {
    // this/e.target is the source node.
    e.target.style.opacity = '1.0';
    [].forEach.call(this.cols, function (col) {
        col.classList.remove('over');
        col.classList.remove('under');
    });
};

MakeListDraggable.prototype.handleDragStart = function(e) {
    // Target (this) element is the source node.
    e.target.style.opacity = '0.4';
    this.dragSrcEl = e.target;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
};

MakeListDraggable.prototype.handleDragOver = function(e) {
    if (e.preventDefault) {
        e.preventDefault(); // Necessary. Allows us to drop.
    }
    e.dataTransfer.dropEffect = 'move';  // See the section on the DataTransfer object.

    return false;
};

MakeListDraggable.prototype.handleDragEnter = function(e) {
    // this / e.target is the current hover target.
    if(this.dragSrcEl.id>=e.target.id)  {
        e.target.classList.add('over');
    }
    else {
        e.target.classList.add('under');
    }
};

MakeListDraggable.prototype.handleDragLeave = function(e) {
    e.target.classList.remove('under');  // this / e.target is previous target element.
    e.target.classList.remove('over');  // this / e.target is previous target element.
};

MakeListDraggable.prototype.handleDrop = function(e) {
    // this/e.target is current target element.
    if (e.stopPropagation) {
        e.stopPropagation(); // Stops some browsers from redirecting.
    }
    // Don't do anything if dropping the same column we're dragging.
    if (this.dragSrcEl != e.target && e.target.id != '') {
        this.reOrder(this.dragSrcEl,e.target);
        //console.log(this.cols);
        var array = [];

        for(var i=0; i<this.cols.length; i++){
            var test = this.cols[i].innerHTML;
            var val = $(test)[0].id;
            array.push(val);
        }
        $(this).trigger('reorder', [array]);
    }

    return false;
};

MakeListDraggable.prototype.reOrder = function(source,target) {
    console.log()
    var start = parseInt(this.cols[source.id].id);
    var end = parseInt(this.cols[target.id].id);
    if(start>end) {
        for(var i = start; i>end;i--) {
            this.swap(i,i-1);
        }
    }
    else {
        for(var i = start; i<end;i++) {
            this.swap(i,i+1);
        }
    }
}

MakeListDraggable.prototype.swap = function(id1,id2) {
    var temp = this.cols[id1].innerHTML;
    this.cols[id1].innerHTML = this.cols[id2].innerHTML;
    this.cols[id2].innerHTML = temp;
}
   return MakeListDraggable;
});
