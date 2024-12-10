import { Component } from '@angular/core';
import { DoctorHandleStore } from '../doctor-handle.store';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-doctor-handle-form',
  templateUrl: './doctor-handle-form.component.html',
  styleUrl: './doctor-handle-form.component.css',
  providers: [DoctorHandleStore]
})
export class DoctorHandleFormComponent {
  readonly visible$ = this.store.is_meeting$;
  form = new UntypedFormGroup({
    id: new UntypedFormControl(null),
    patientName: new UntypedFormControl({ value: null, disabled: true }),
    birth: new UntypedFormControl({ value: null, disabled: true }),
    appointmentDate: new UntypedFormControl({ value: null, disabled: true }),
    address: new UntypedFormControl({ value: null, disabled: true }),
    comment: new UntypedFormControl({ value: null, disabled: true }),
    img: new UntypedFormControl(null),
  });

  cancelForm = new UntypedFormGroup({
    noShow: new UntypedFormControl(false),
    noNeed: new UntypedFormControl(false),
    doctorIssue: new UntypedFormControl(false),
    other: new UntypedFormControl(false), // Thêm control other
    otherReason: new UntypedFormControl(''),
  });

  cancelReasons = [
    { label: 'Bệnh nhân không đến', value: 'noShow' },
    { label: 'Bệnh nhân không khám nữa', value: 'noNeed' },
    { label: 'Bác sĩ gặp vấn đề', value: 'doctorIssue' },
    { label: 'Lý do khác', value: 'other' },
  ];

  isCancelModalVisible = false;
  isOtherReasonSelected = false;

  constructor(
    private store: DoctorHandleStore
  ) {
    this.cancelForm.reset();
    this.store.meeting_value$.subscribe((s) => {
      this.form.patchValue({
        ...s
      })
    })
    this.cancelForm.valueChanges.subscribe(() => {
      this.validateSubmitButton();
    });
  }

  close() {
    this.store.setIsMeeting(false);
  }

  submit() {
    this.store.setIsMeeting(false);
    this.store.endMeeting(this.form.get('id')?.value);
  }

  // Modal methods
  showCancelModal() {
    this.isCancelModalVisible = true;
  }

  handleCancel() {
    this.store.cancelMeeting(this.form.get('id')?.value);
    this.cancelForm.reset();
    this.isCancelModalVisible = false;
    this.isOtherReasonSelected = false;
  }

  onReasonChange(reason: string, event: Event) {
    const checkbox = event.target as HTMLInputElement;
    const isChecked = checkbox.checked;
  
    if (reason === 'other') {
      this.isOtherReasonSelected = isChecked;
      this.cancelForm.get('other')?.setValue(isChecked);
      
      if (!isChecked) {
        this.cancelForm.get('otherReason')?.setValue('');
      }
    }

    this.validateSubmitButton();
  }

  submitCancel() {
    const selectedReasons = this.cancelForm.value;
    this.store.setIsMeeting(false);
    // Implement cancellation logic
    this.handleCancel();
  }

  validateSubmitButton(): boolean {
    const formValues = this.cancelForm.value;
    const isAnyChecked = 
      formValues.noShow || 
      formValues.noNeed || 
      formValues.doctorIssue || 
      formValues.other;
    const isOtherReasonValid = !formValues.other || 
      (formValues.other && formValues.otherReason?.trim() !== '');

    return isAnyChecked && isOtherReasonValid;
  }
}