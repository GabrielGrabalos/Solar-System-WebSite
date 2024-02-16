class PanZoom {
    constructor(args) {
        this.offsetX = args.offsetX || 0;
        this.offsetY = args.offsetY || 0;
        this.scale = args.scale || 1;
        this.minZoom = args.minZoom || 0.1;
        this.maxZoom = args.maxZoom || 10;

        this.worldDimensions = args.worldDimensions; // { width, height }

        this.drag = false;
        this.dragStart = { x: 0, y: 0 };
        this.dragEnd = { x: 0, y: 0 };

        this.click = true;
    }

    get OffsetX() {
        return this.offsetX;
    }

    set OffsetX(value) {
        this.offsetX = value;
    }

    get OffsetY() {
        return this.offsetY;
    }

    set OffsetY(value) {
        this.offsetY = value;
    }

    get Scale() {
        return this.scale;
    }

    set Scale(value) {
        this.scale = Math.min(Math.max(this.minZoom, value), this.maxZoom);
    }

    get MinZoom() {
        return this.minZoom;
    }

    set MinZoom(value) {
        if (value <= 0) {
            throw new RangeError('minZoom must be greater than 0');
        }
        this.minZoom = value;
    }

    get MaxZoom() {
        return this.maxZoom;
    }

    set MaxZoom(value) {
        if (value <= 0) {
            throw new RangeError('maxZoom must be greater than 0');
        }
        this.maxZoom = value;
    }

    get Click() {
        return this.click;
    }

    set Click(value) {
        this.click = value;
    }

    get Dragging() {
        return this.drag;
    }

    set Dragging(value) {
        this.drag = value;
    }

    // ======================== || CORE FUNCTIONS || ======================== //

    // World to screen functions:
    WorldToScreenX(worldX) {
        return (worldX - this.OffsetX) * this.Scale;
    }

    WorldToScreenY(worldY) {
        return (worldY - this.OffsetY) * this.Scale;
    }

    // Screen to world functions:
    ScreenToWorldX(screenX) {
        return (screenX / this.Scale) + this.OffsetX;
    }

    ScreenToWorldY(screenY) {
        return (screenY / this.Scale) + this.OffsetY;
    }

    // ======================== || OFFSET FUNCTIONS || ======================== //

    RestrictOffset() {
        if (!this.worldDimensions) return; // Doesn't throw an error because is a function called by the class.

        this.OffsetX = Math.min(
            Math.max(this.OffsetX, 0),
            this.worldDimensions.width - (this.worldDimensions.width / this.Scale) 
                                         // ^ Accounts for the size of the 'camera'
        );

        this.OffsetY = Math.min(
            Math.max(this.OffsetY, 0),
            this.worldDimensions.height - (this.worldDimensions.height / this.Scale)
                                          // ^ Accounts for the size of the 'camera'
        );
    }

    CenterOffset() {
        if(!this.worldDimensions)
            throw new Error('World dimensions not set');

        // Sets the offset to the center of the world
        // and subtracts half of the 'camera' width and
        // height to center the view:

        this.OffsetX = (this.worldDimensions.width / 2) - (this.worldDimensions.width / this.Scale / 2);
        this.OffsetY = (this.worldDimensions.height / 2) - (this.worldDimensions.height / this.Scale / 2);
    }

    // ======================== || MOUSE FUNCTIONS || ======================== //

    // Mouse functions:
    MouseDown(mouseX, mouseY) {
        this.dragStart.x = mouseX;
        this.dragStart.y = mouseY;
        this.drag = true;

        if (!this.click) this.click = true; // Click is allowed if the mouse is not dragging.
    }

    MouseMove(mouseX, mouseY) {
        if (!this.drag) return;

        if (this.click) this.click = false; // Click is not allowed if the mouse is dragging.

        // Gets drag end:
        this.dragEnd.x = mouseX;
        this.dragEnd.y = mouseY;

        // Updates the offset:
        this.OffsetX -= (this.dragEnd.x - this.dragStart.x) / this.Scale;
        this.OffsetY -= (this.dragEnd.y - this.dragStart.y) / this.Scale;

        this.dragStart = { ...this.dragEnd }; // Resets the dragStart.

        this.RestrictOffset();
    }

    MouseUp() {
        this.drag = false;
    }

    MouseWheel(mouseX, mouseY, delta) {
        const mouseBeforeZoomX = this.ScreenToWorldX(mouseX);
        const mouseBeforeZoomY = this.ScreenToWorldY(mouseY);

        // Zooms in or out:
        this.Scale += delta * (-0.001) * (this.Scale / 2);

        // Restrict zoom:
        this.Scale = Math.min(Math.max(this.MinZoom, this.Scale), this.MaxZoom);

        // Mouse after zoom:
        const mouseAfterZoomX = this.ScreenToWorldX(mouseX);
        const mouseAfterZoomY = this.ScreenToWorldY(mouseY);

        // Adjusts offset so the zoom occurs relative to the mouse position:
        this.OffsetX += (mouseBeforeZoomX - mouseAfterZoomX);
        this.OffsetY += (mouseBeforeZoomY - mouseAfterZoomY);

        this.RestrictOffset();
    }
}