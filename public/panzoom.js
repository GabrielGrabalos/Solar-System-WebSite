class PanZoom {
    constructor(args) {
        this.offsetX = args.offsetX || 0;
        this.offsetY = args.offsetY || 0;
        this.scale = args.scale || 1;
        this.minZoom = args.minZoom || 0.1;
        this.maxZoom = args.maxZoom || 10;

        this.worldDimensions = args.worldDimensions; // { width, height }

        this.screenDimensions = args.screenDimensions; // { width, height }

        // Calculates the minimum zoom based on the world and screen dimensions:
        this.calculateMinZoom();

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

    get WorldDimensions() {
        return this.worldDimensions;
    }

    set WorldDimensions(value) {
        this.worldDimensions = value;

        this.calculateMinZoom();
    }

    get ScreenDimensions() {
        return this.screenDimensions;
    }

    set ScreenDimensions(value) {
        this.OffsetX -= (value.width - this.screenDimensions.width) / this.Scale / 2;
        this.OffsetY -= (value.height - this.screenDimensions.height) / this.Scale / 2;

        this.screenDimensions = value;

        this.calculateMinZoom();
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

    // Calculates the minimum zoom based on the world and screen dimensions:
    calculateMinZoom() {
        if (!this.worldDimensions)
            return;

        if (!this.screenDimensions)
            return;

        const minZoomX = this.screenDimensions.width / this.worldDimensions.width;
        const minZoomY = this.screenDimensions.height / this.worldDimensions.height;

        this.MinZoom = Math.max(minZoomX, minZoomY);

        this.Scale = this.scale; // Restricts the current zoom.
    }

    RestrictOffset() {
        if (!this.worldDimensions) return; // Doesn't throw an error because is a function called by the class.

        if (!this.screenDimensions) return; // Doesn't throw an error because is a function called by the class.

        if (this.OffsetX < -this.worldDimensions.width / 2)
            this.OffsetX = -this.worldDimensions.width / 2;

        if (this.OffsetY < -this.worldDimensions.height / 2)
            this.OffsetY = -this.worldDimensions.height / 2;

        if (this.OffsetX > this.worldDimensions.width / 2 - this.screenDimensions.width / this.Scale)
            this.OffsetX = this.worldDimensions.width / 2 - this.screenDimensions.width / this.Scale;

        if (this.OffsetY > this.worldDimensions.height / 2 - this.screenDimensions.height / this.Scale)
            this.OffsetY = this.worldDimensions.height / 2 - this.screenDimensions.height / this.Scale;
    }

    CenterOffset() {
        if (!this.worldDimensions)
            throw new Error('World dimensions not set');

        if (!this.screenDimensions)
            throw new Error('Screen dimensions not set');

        // Sets the offset to the center of the world
        // and subtracts half of the 'camera' width and
        // height to center the view:

        this.OffsetX = - (this.screenDimensions.width / this.Scale) / 2;
        this.OffsetY = - (this.screenDimensions.height / this.Scale) / 2;
    }

    // ======================== || ANIMATION FUNCTIONS || ======================== //

    requestFocusOn(worldX, worldY) {
        this.OffsetX = worldX - this.screenDimensions.width / this.Scale / 2;
        this.OffsetY = worldY - this.screenDimensions.height / this.Scale / 2;

        this.RestrictOffset();
    }

    requestAnimationFrameTo(worldX, worldY, scale, amountOfFramesLeft) {
        const worldXBeforeZoom = this.ScreenToWorldX(worldX - this.screenDimensions.width / 2 / scale);
        const worldYBeforeZoom = this.ScreenToWorldY(worldY - this.screenDimensions.height / 2 / scale);

        this.Scale += (scale - this.Scale) / amountOfFramesLeft;

        const worldXAfterZoom = this.ScreenToWorldX(worldX - this.screenDimensions.width / 2 / this.Scale);
        const worldYAfterZoom = this.ScreenToWorldY(worldY - this.screenDimensions.height / 2 / this.Scale);

        const widthOffset = worldXBeforeZoom - worldXAfterZoom;
        const heightOffset = worldYBeforeZoom - worldYAfterZoom;

        this.OffsetX += ((worldX - this.screenDimensions.width / 2 / this.Scale) - this.OffsetX + widthOffset) / amountOfFramesLeft;
        this.OffsetY += ((worldY - this.screenDimensions.height / 2 / this.Scale) - this.OffsetY + heightOffset) / amountOfFramesLeft;

        this.RestrictOffset();
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

/**
 * 
 * Notes:
 * 
 *      - * Tick function *: 
 *          Maybe create a tick function to update the panzoom.
 *          This would allow the panzoom to be updated in the main loop,
 *          making it easier to manage animations and other stuff.
 * 
 *      - * Animation class *:
 *          Create and integrate an animation class to hold all the
 *          necessary information to animate the panzoom appropriately.
 *          This would be achievable by using the tick function.
 * 
 *      - * Parallax implementation *:
 *          Allow for z axis support, so the panzoom can be used to
 *          create parallax effects.
 * 
 *          The whole concept would have to be changed to acchieve something like this.
 * 
 **/