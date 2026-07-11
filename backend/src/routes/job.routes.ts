import { Router } from 'express';
import { JobController } from '../controllers/JobController';
import { requireAuth, requireRole } from '../middleware/auth.middleware';

const router = Router();
const jobController = new JobController();

// --- Public/Worker Routes (Auth required for personalization, but could be optional for public jobs) ---
router.get('/search', jobController.searchJobs);
router.get('/recommended', requireAuth, jobController.getRecommendedJobs);
router.get('/nearby', requireAuth, jobController.getNearbyJobs);
router.get('/:id', jobController.getJobById);

// --- Worker Protected Routes ---
router.get('/applications/me', requireAuth, requireRole('worker'), jobController.getWorkerApplications);
router.post('/:id/apply', requireAuth, requireRole('worker'), jobController.applyForJob);
router.post('/:id/bookmark', requireAuth, requireRole('worker'), jobController.toggleBookmark);

// --- Employer Protected Routes ---
router.post('/', requireAuth, requireRole('employer'), jobController.createJob);
router.get('/employer/me', requireAuth, requireRole('employer'), jobController.getEmployerJobs);
router.get('/employer/stats', requireAuth, requireRole('employer'), jobController.getEmployerDashboardStats);
router.put('/:id', requireAuth, requireRole('employer'), jobController.updateJob);
router.patch('/:id/status', requireAuth, requireRole('employer'), jobController.changeJobStatus);
router.patch('/applications/:appId/status', requireAuth, requireRole('employer'), jobController.updateApplicationStatus);
router.delete('/:id', requireAuth, requireRole('employer'), jobController.softDeleteJob);
router.get('/:id/applicants', requireAuth, requireRole('employer'), jobController.getJobApplicants);

export default router;
