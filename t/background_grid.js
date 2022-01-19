import { Grid } from "./grid.js";

export class BackgroundGrid extends Grid {
    constructor() {
        super();
        this.fillStyle = 'rgba(100, 100, 100, 1)';
        this.strokeStyle = 'rgba(80, 80, 80, 1)';
    }

    render(ctx) {
        super.render(ctx);
    }
}