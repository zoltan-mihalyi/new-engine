import { RenderComponent, Renderer } from '../../feature/systems/RenderSystem';
import { Entity } from '../../core/Entity';
import { ControlComponent } from '../ControlSystem';
import { PlayerControl } from './control/PlayerControl';

export class CharacterRenderer implements Renderer {
    render(ctx:CanvasRenderingContext2D, x:number, y:number, e:Entity<ControlComponent & RenderComponent>):void {
        const isPlayer = e.get('control') instanceof PlayerControl;
        ctx.fillStyle = isPlayer ? 'blue' : 'red';
        ctx.fillRect(x, y, 20, 20);
    }
}