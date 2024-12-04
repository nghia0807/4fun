import { Component, Input } from '@angular/core';
import { AppointmentStatus } from '../../../../component/enum';
interface AppointmentStatusData {
  status: AppointmentStatus;
  count: number;
}

@Component({
  selector: 'app-doctor-welcome-bar-chart',
  templateUrl: './doctor-welcome-bar-chart.component.html',
  styleUrl: './doctor-welcome-bar-chart.component.css'
})
export class DoctorWelcomeBarChartComponent {
  @Input() appointments: AppointmentStatusData[] = [];

  chartData: any[] = [];

  private readonly STATUS_LABELS = {
    [AppointmentStatus.CANCEL]: 'Cancelled',
    [AppointmentStatus.MEETING]: 'Ongoing',
    [AppointmentStatus.READY]: 'Ready',
    [AppointmentStatus.ENDED]: 'ENDED Soon',
    [AppointmentStatus.PRESERVED]:'Preserved',
  };

  private readonly COLORS = {
    [AppointmentStatus.CANCEL]: '#FF6384',
    [AppointmentStatus.MEETING]: '#36A2EB',
    [AppointmentStatus.READY]: '#4CAF50',
    [AppointmentStatus.ENDED]: '#FFA500',
      [AppointmentStatus.PRESERVED]: '#FFA500'
  };

  ngOnInit() {
    this.generateBarChart();
  }

  generateBarChart() {
    const maxCount = Math.max(...this.appointments.map(a => a.count));
    const chartHeight = 180;
    const barWidth = 70;
    const spacing = 20;

    this.chartData = this.appointments.map((item, index) => {
      const height = (item.count / maxCount) * chartHeight;

      return {
        status: item.status,
        label: this.STATUS_LABELS[item.status],
        count: item.count,
        color: this.COLORS[item.status],
        x: 50 + index * (barWidth + spacing),
        y: 200 - height,
        width: barWidth,
        height: height
      };
    });
  }
}
