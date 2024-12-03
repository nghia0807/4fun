import { Injectable } from '@angular/core';
import emailjs from '@emailjs/browser';

@Injectable({
  providedIn: 'root'
})
export class EmailVerificationService {
  // Cấu hình từ EmailJS
  private serviceId = 'service_fqxqd4a';
  private templateId = 'template_s2e57cf';
  private templateIdAppointment = 'template_j1hn0aw';

  private publicKey = 'U16TK9z35DmM5jj_y';

  // Gửi email xác thực
  async sendVerificationEmail(email: string, code: string): Promise<boolean> {
    try {
      const templateParams = {
        email: email,
        from_name: email,
        to_name: email,
        message: code
      };

      // Gửi email
      const response = await emailjs.send(
        this.serviceId, 
        this.templateId, 
        templateParams,
        this.publicKey
      );
      return true;
    } catch (error) {
      return false;
    }
  }

  async sendAppointmentEmail(email: string, name: string,id: string, date: string, time: string, doctorName: string ): Promise<boolean> {
    try {
      const templateParams = {
        email: email,
        to_name: name,
        id: id,
        date: date,
        time: time,
        doctorName: doctorName
      };

      // Gửi email
      const response = await emailjs.send(
        this.serviceId, 
        this.templateIdAppointment, 
        templateParams,
        this.publicKey
      );
      return true;
    } catch (error) {
      return false;
    }
  }
}