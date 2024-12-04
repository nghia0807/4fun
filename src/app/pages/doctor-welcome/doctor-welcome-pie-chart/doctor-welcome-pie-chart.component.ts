import { Component, Input } from '@angular/core';
import { AppointmentStatus } from '../../../../component/enum';
interface AppointmentStatusData {
  status: AppointmentStatus;
  count: number;
}
@Component({
  selector: 'app-doctor-welcome-pie-chart',
  templateUrl: './doctor-welcome-pie-chart.component.html',
  styleUrl: './doctor-welcome-pie-chart.component.css'
})
export class DoctorWelcomePieChartComponent {
  @Input() appointments: AppointmentStatusData[] = [];

  private readonly STATUS_LABELS = {
    [AppointmentStatus.CANCEL]: 'Cancelled Appointments',
    [AppointmentStatus.MEETING]: 'Ongoing Meetings',
    [AppointmentStatus.READY]: 'Ready for Meeting',
    [AppointmentStatus.ENDED]: 'ENDED Soon',
    [AppointmentStatus.PRESERVED]: 'Preserved Appointments',
  };

  chartData: any[] = [];
  private readonly COLORS = {
    [AppointmentStatus.CANCEL]: '#FF6384',
    [AppointmentStatus.MEETING]: '#36A2EB',
    [AppointmentStatus.READY]: '#4CAF50',
    [AppointmentStatus.ENDED]: '#FFA500',
    [AppointmentStatus.PRESERVED]: 'Preserved Appointments',
  };

  ngOnInit() {
    this.generatePieChart();
  }

  generatePieChart() {
    const totalCount = this.appointments.reduce((sum, item) => sum + item.count, 0);
    let startAngle = 0;

    this.chartData = this.appointments.map((item) => {
      const percentage = (item.count / totalCount) * 100;
      const angle = (percentage / 100) * 360;
      const endAngle = startAngle + angle;

      const path = this.describeArc(0, 0, 100, startAngle, endAngle);

      const slice = {
        status: item.status,
        label: this.STATUS_LABELS[item.status],
        count: item.count,
        percentage: percentage,
        color: this.COLORS[item.status],
        path: path
      };

      startAngle = endAngle;
      return slice;
    });
  }

  // Helper method to create arc path
  describeArc(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
    const start = this.polarToCartesian(x, y, radius, endAngle);
    const end = this.polarToCartesian(x, y, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    return [
      "M", start.x, start.y,
      "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
      "L", 0, 0,
      "Z"
    ].join(" ");
  }

  // Convert polar coordinates to Cartesian
  polarToCartesian(centerX: number, centerY: number, radius: number, angleInDegrees: number) {
    const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
    return {
      x: centerX + (radius * Math.cos(angleInRadians)),
      y: centerY + (radius * Math.sin(angleInRadians))
    };
  }
}
