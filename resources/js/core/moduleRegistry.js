import { lazy } from 'react';

/**
 * Module Registry — daftarkan module_key ke komponen halaman React di sini.
 * Jika module_key ada di database tapi belum didaftarkan di sini,
 * sistem akan otomatis menampilkan halaman "Module Belum Dibuat".
 */
const moduleRegistry = {
    'dashboard': lazy(() => import('../modules/dashboard/pages/DashboardPage')),
    'user-management': lazy(() => import('../modules/admin/user-management/pages/UserManagementPage')),
    'group-management': lazy(() => import('../modules/admin/group-management/pages/GroupManagementPage')),
    'menu-management': lazy(() => import('../modules/admin/menu-management/pages/MenuManagementPage')),
    'menu-access-management': lazy(() => import('../modules/admin/menu-access-management/pages/MenuAccessManagementPage')),
    'system-setting': lazy(() => import('../modules/admin/system-setting/pages/SystemSettingPage')),
    'audit-log': lazy(() => import('../modules/admin/audit-log/pages/AuditLogPage')),
    'peserta-pkl': lazy(() => import('../modules/peserta-pkl/pages/PesertaPklPage')),
    'task-assignment': lazy(() => import('../modules/task-assignment/pages/TaskAssignmentPage')),
    'attendance': lazy(() => import('../modules/attendance/pages/AttendancePage')),
    'evaluation': lazy(() => import('../modules/evaluation/pages/EvaluationPage')),
    'certificate': lazy(() => import('../modules/certificate/pages/CertificatePage')),
    'daily-logbook': lazy(() => import('../modules/daily-logbook/pages/DailyLogbookPage')),
    'my-task': lazy(() => import('../modules/my-task/pages/MyTaskPage')),
    'my-attendance': lazy(() => import('../modules/my-attendance/pages/MyAttendancePage')),
    'my-profile': lazy(() => import('../modules/my-profile/pages/MyProfilePage')),
};

export function getModuleComponent(moduleKey) {
    return moduleRegistry[moduleKey] || null;
}

export default moduleRegistry;
