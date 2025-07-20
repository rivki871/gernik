import { isPlatformBrowser } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppService } from 'app/app.service';
import Chart from 'chart.js/auto';
import { client } from '../client';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-chart',
    templateUrl: './chart.component.html',
    styleUrls: ['./chart.component.css']
})
export class ChartComponent implements OnInit {
    public chart: any;

    constructor(public service: AppService,
        private dialogRef: MatDialogRef<ChartComponent>
    ) { }

    ngOnInit(): void {
        this.fetchAndRenderChart();
    }

    fetchAndRenderChart() {
        this.service.getAllLoans().subscribe((loans: client[]) => {
            const streetCounts: { [key: string]: number } = {};

            loans.forEach(loan => {
                const cleanedStreetName = loan.address?.replace(/\s+\d+$/, '');
                if (cleanedStreetName) {
                    if (!streetCounts[cleanedStreetName]) {
                        streetCounts[cleanedStreetName] = 0;
                    }
                    streetCounts[cleanedStreetName]++;
                }
            });
            // המרת המידע למערך של זוגות [שם רחוב, מספר השאלות]
            const streetEntries = Object.entries(streetCounts);

            // מיין את המערך לפי השמות
            streetEntries.sort(([streetA], [streetB]) => streetA.localeCompare(streetB));

            // הפרד את השמות והמספרים למערכים נפרדים
            const cleanedStreetNames = streetEntries.map(([street]) => street);
            const loanCounts = streetEntries.map(([, count]) => count);

            this.createChart(cleanedStreetNames, loanCounts);
        });
    }


    createChart(streetNames: string[], loanCounts: number[]) {
        const ctx = document.getElementById('MyChart') as HTMLCanvasElement;
        const totalLoans = loanCounts.reduce((acc, count) => acc + count, 0);

        new Chart(ctx, {
            type: 'bar',
            data: {

                labels: streetNames,
                datasets: [{
                    label: 'מספר השאלות',
                    data: loanCounts,
                    backgroundColor: 'rgba(194, 69, 158, 0.2)',
                    borderColor: 'rgb(225, 87, 195)',
                    borderWidth: 2
                }]
            },

            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `מספר ההשאלות הכולל: ${totalLoans}`, // הוספת הכותרת עם הסכום
                        font: {
                            size: 24,
                            family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                        }
                    },
                    legend: {
                        labels: {
                            font: {
                                size: 20,
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 20, // גודל הפונט
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" // משפחת הפונט
                            }
                        }
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 20, // גודל הפונט
                                family: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" // משפחת הפונט
                            }
                        }
                    }
                },
                interaction: {
                    mode: 'index',
                    intersect: false
                },
            }
        });
    }

    goBack() {
        this.dialogRef.close();
    }

}