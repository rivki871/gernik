import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrl: './chart.component.css'
})
export class ChartComponent implements OnInit {
    public chart: any;

    ngOnInit(): void {
        this.createChart();
      }

    createChart() {

        this.chart = new Chart("MyChart", {
            type: 'bar', //this denotes tha type of chart

            data: {// values on X-Axis
                labels: ['ינואר', 'פברואר', 'מרץ',],
                datasets: [
                    {
                        label: "השאלות",
                        data: ['13', '141', '13', '15', '17',
                            '574', '573', '576'],
                        backgroundColor: 'blue'
                    },
                    // {
                    //     label: "Profit",
                    //     data: ['542', '542', '536', '327', '17',
                    //         '0.00', '538', '541'],
                    //     backgroundColor: 'limegreen'
                    // }
                ]
            },
            options: {
                aspectRatio: 2.5
            }

        });
    }
}