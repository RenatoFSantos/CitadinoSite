import { BarComponent } from './../bar/bar.component';
import { ProgressDirective } from './../../directives/progress.directive';
import {Component, Input} from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';


@Component({
    selector: 'progressbar, [progressbar]',
    templateUrl: './progressbar.component.html',
    styleUrls: ['./progressbar.component.css']
})
export class ProgressbarComponent {
    @Input() private animate:boolean;
    @Input() private max:number;
    @Input() private type:string;
    @Input() private value:number;
}
