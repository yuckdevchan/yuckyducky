export class DisplayBox {
    constructor(posCenterX, posCenterY) {
        [this.posCenterX, this.posCenterY] = [posCenterX, posCenterY]
    }

    static getWidth() {
        return 100;
    }

    static getHeight() {
        return 100;
    }

    render(ctx) {
        let posStartX = this.posCenterX - DisplayBox.getWidth() / 2;
        let posStartY = this.posCenterY - DisplayBox.getHeight() / 2;
        ctx.fillStyle = 'rgba(100, 100, 100, 1)';
        ctx.fillRect(posStartX, posStartY, DisplayBox.getWidth(), DisplayBox.getHeight());
        ctx.lineWidth = 4;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(posStartX, posStartY, DisplayBox.getWidth(), DisplayBox.getHeight());
    }
};