import { Component, OnInit, OnDestroy, Input, Host, Directive } from '@angular/core';
import {NgClass, NgStyle} from '@angular/common';

import {ProgressDirective} from './../../directives/progress.directive';

@Component({
    selector: 'bar, [bar]',
    templateUrl: './bar.component.html',
    styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit, OnDestroy {
    @Input() public type:string;

    @Input() public get value():number {
        return this._value;
    }

    public set value(v:number) {
        if (!v && v !== 0) {
            return;
        }
        this._value = v;
        this.recalculatePercentage();
    }

    public percent:number = 0;
    public transition:string;

    private _value:number;

    constructor(@Host() public progress:ProgressDirective) {
    }

    ngOnInit() {
        this.progress.addBar(this);
    }

    ngOnDestroy() {
        this.progress.removeBar(this);
    }

    public recalculatePercentage() {
        this.percent = +(100 * this.value / this.progress.max).toFixed(2);

        let totalPercentage = this.progress.bars.reduce(function (total, bar) {
            return total + bar.percent;
        }, 0);

        if (totalPercentage > 100) {
            this.percent -= totalPercentage - 100;
        }
    }
}

