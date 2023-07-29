export class UIBlock {

    //init private variables
    private _x: number = 0;
    private _y: number = 0;

    //keep track of this block's previous position
    private _oldX: number = 0;
    private _oldY: number = 0;

    private _visible: boolean = true;

    //needs to be set by developer
    private _displayWidth: number = 0;
    private _displayHeight: number = 0;

    //an array of the children
    private children: any[] = [];

    //current child count used for indexing
    private childIndex: number = -1;

    //used to identify this as a UIBlock to another UIBlock
    private _depth: number = 1;
    private _alpha: number = 1;
    private _isPosBlock: boolean = true;

    constructor() {

    }
    set depth(val: number) {
        //console.log(val);
        this.depth = val;
        if (this.children.length > 0) {
            this.setChildDepth(this.children[0]);
        }
    }
    get depth() {
        return this._depth;
    }
    setChildDepth(child: any) {
        //console.log(child);
        var realDepth = this._depth * 100 + child.childIndex;
        console.log(realDepth);
        if (child.scene == undefined) {
            // child.scene = gw.model.currentScene;
            console.error('child.scene is undefined in UIBlock');
        }
        child.depth = realDepth;
        //  child.setDepth(realDepth);
        if (child.nextChild != null) {
            this.setChildDepth(child.nextChild);
        }
    }
    set x(val) {
        //record the current x into oldX
        this._oldX = this._x;
        //
        //update the value
        this._x = val;
        //
        //update the children
        this.updatePositions();
    }
    set y(val) {
        //record the current y into oldY
        this._oldY = this._y;
        //
        //update the value
        this._y = val;
        //update the children
        this.updatePositions();
    }
    //getters
    get x() {
        return this._x;
    }
    get y() {
        return this._y;
    }
    //add a child
    add(child: any) {
        //up the index
        this.childIndex++;
        //make a note of the index inside the child
        child.childIndex = this.childIndex;
        //add to the array
        this.children.push(child);
        //build the linked list
        this.buildList();
    }
    /* removeAvatar(userID) {
         if (this.avatars[userID]) {
             var avatar = this.avatars[userID];
             if (avatar.prevAvatar) avatar.prevAvatar.nextAvatar = avatar.nextAvatar;
             avatar.destroy();
             delete this.avatars[userID];
         }
     }*/
    removeChild(child: any) {
        //take the child off the array based on index
        this.children.splice(child.childIndex, 1);

        //
        //rebuild the linked list
        this.buildList();
        //rebuild the indexes
        var len = this.children.length;
        for (var i = 0; i < len; i++) {
            this.children[i].childIndex = i;
        }
        //set the childIndex to the length of the array
        this.childIndex = len;
    }
    buildList() {
        var len = this.children.length;
        if (len > 1) {
            for (var i = 1; i < len; i++) {
                //set the current child to the previous child's nextChild property
                this.children[i - 1].nextChild = this.children[i];
            }
        }
        this.children[len - 1].nextChild = null;
    }
    willRender() {

    }
    get displayWidth() {
        return this._displayWidth;
    }
    get displayHeight() {
        return this._displayHeight;
    }
    setSize(w: number, h: number) {
        this._displayWidth = w;
        this._displayHeight = h;
    }
    setXY(x: number, y: number) {
        this.x = x;
        this.y = y;
        this.updatePositions();
    }
    set visible(val) {
        if (this._visible != val) {
            this._visible = val;
            if (this.children.length > 0) {
                //send the first child to the updateChildVisible function
                this.updateChildVisible(this.children[0], val);
            }
        }
    }
    get visible() {
        return this._visible;
    }
    //
    //
    //
    //
    set alpha(val) {
        if (this._alpha != val) {
            this._alpha = val;
            if (this.children.length > 0) {
                //send the first child to the updateChildalpha function
                this.updateChildAlpha(this.children[0], val);
            }
        }
    }
    get alpha() {
        return this._alpha;
    }
    setScrollFactor(scroll: any) {
        //setScrollFactor
        if (this.children.length > 0) {
            //send the first child to the updateChildalpha function
            this.updateChildScroll(this.children[0], scroll);
        }
    }
    updateChildScroll(child: any, scroll: any) {
        child.setScrollFactor(scroll);
        if (child.nextChild) {
            child.nextChild.setScrollFactor(scroll);
        }
    }
    updateChildAlpha(child: any, alpha: any) {
        child.alpha = alpha;
        if (child.isPosBlock == true) {
            child.alpha = alpha;
        }
        if (child.nextChild != null) {
            //if the child has a nextChild call this function recursively
            this.updateChildAlpha(child.nextChild, alpha);
        }
    }
    updateChildVisible(child: any, vis: any) {
        child.visible = vis;
        if (child.isPosBlock == true) {
            child.visible = vis;
        }
        if (child.nextChild != null) {
            //if the child has a nextChild call this function recursively
            this.updateChildVisible(child.nextChild, vis);
        }
    }
    updateChildPos(child: any) {
        child.y = child.y - this._oldY + this._y;
        child.x = child.x - this._oldX + this._x;
        if (child.isPosBlock == true) {
            child.updatePositions();
        }
        if (child.nextChild != null) {
            //if the child has a nextChild call this function recursively
            this.updateChildPos(child.nextChild);
        }
        //set the old values to the new
        this._oldX = this._x;
        this._oldY = this._y;
    }
    updatePositions() {
        if (this.children) {
            if (this.children.length > 0) {
                //send the first child to the updateChildPos function
                this.updateChildPos(this.children[0]);
            }
        }
    }
    getRelPos(child: any) {
        return {
            x: child.x - this.x,
            y: child.y - this.y
        }
    }
    once(t: any, e: any, i: any) { }
    getChildren(myArray: any, child: any) {
        myArray.push(child);
        if (child.isPosBlock) {
            if (child.children.length > 0) {
                child.getChildren(myArray, child.children[0]);
            }
        }
        if (child.nextChild) {
            this.getChildren(myArray, child.nextChild);
        }
    }
    getAllChildren() {
        var childArray: any[] = [];
        if (this.children.length > 0) {
            this.getChildren(childArray, this.children[0]);
        }
        return childArray;
    }
    getChildAt(index: any) {
        return this.children[index];
    }
    setMask(mask: any) {
        this.getAllChildren().forEach(function (child: any) {
            child.setMask(mask);
        }.bind(this));
    }

    destroy() {
        var childArray = this.getAllChildren();
        this.childIndex = -1;
        //console.log(childArray);
        var len = childArray.length;
        for (var i = 0; i < len; i++) {
            childArray[i].destroy();
        }
        this.children.length = 0;
        childArray.length = 0;
    }
}
