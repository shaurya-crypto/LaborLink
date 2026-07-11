import { EventEmitter } from 'events';

class AppEventPublisher extends EventEmitter {
  // Define strong typings if needed
  emitJobPosted(jobId: string, employerId: string) {
    this.emit('job:posted', { jobId, employerId });
  }

  emitJobApplied(jobId: string, workerId: string, applicationId: string) {
    this.emit('job:applied', { jobId, workerId, applicationId });
  }

  emitApplicantShortlisted(jobId: string, workerId: string, employerId: string) {
    this.emit('applicant:shortlisted', { jobId, workerId, employerId });
  }

  emitWorkerHired(jobId: string, workerId: string, employerId: string) {
    this.emit('worker:hired', { jobId, workerId, employerId });
  }
}

export const EventPublisher = new AppEventPublisher();

// Future: In Phase 1.3D, listeners will be attached to EventPublisher to send push notifications.
EventPublisher.on('job:posted', (data) => console.log('[Event] Job Posted:', data));
EventPublisher.on('job:applied', (data) => console.log('[Event] Job Applied:', data));
