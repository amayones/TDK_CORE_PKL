import { useState, useEffect, useCallback } from 'react';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { fetchProjects, createProject, updateProject, deleteProject } from '../services/projectService';
import ProjectFormModal from '../components/ProjectFormModal';
import { useMenu } from '../../../core/MenuContext';

const STATUS_BADGE = {
    planning: 'bg-gray-100 text-gray-600',
    in_progress: 'bg-blue-100 text-blue-700',
    completed: 'bg-green-100 text-green-700',
    on_hold: 'bg-amber-100 text-amber-700',
};

const STATUS_LABEL = {
    planning: 'Perencanaan',
    in_progress: 'Berjalan',
    completed: 'Selesai',
    on_hold: 'Ditunda',
};

export default function ProjectManagementPage() {
    const { hasPermission } = useMenu();
    const [projects, setProjects] = useState(null);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const loadProjects = useCallback(async () => {
        setLoading(true);
        try {
            const data = await fetchProjects();
            setProjects(data);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadProjects();
    }, [loadProjects]);

    const openCreateModal = () => {
        setEditingProject(null);
        setModalOpen(true);
    };

    const openEditModal = (project) => {
        setEditingProject(project);
        setModalOpen(true);
    };

    const handleSubmit = async (form) => {
        setSubmitting(true);
        try {
            if (editingProject) {
                await updateProject(editingProject.id, form);
                window.__APP__.alert('Project berhasil diupdate', 'success');
            } else {
                await createProject(form);
                window.__APP__.alert('Project berhasil ditambahkan', 'success');
            }
            setModalOpen(false);
            loadProjects();
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (project) => {
        const confirmed = await window.__APP__.confirm({
            type: 'danger',
            title: 'Hapus Project',
            message: `Apakah Anda yakin ingin menghapus project "${project.name}"?`,
            confirmText: 'Ya, Hapus',
            cancelText: 'Batal'
        });
        if (!confirmed) return;
        await deleteProject(project.id);
        window.__APP__.alert('Project berhasil dihapus', 'success');
        loadProjects();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Project Management</h2>
                    <p className="text-gray-500 text-sm">Kelola daftar project.</p>
                </div>
                {hasPermission('project-management', 'can_create') && (
                    <button
                        onClick={openCreateModal}
                        className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded text-sm hover:bg-blue-800"
                    >
                        <Plus size={16} /> Tambah Project
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-blue-700" size={28} />
                    </div>
                ) : (
                    <table className="w-full text-sm">
                        <thead className="bg-gray-50 text-gray-600 text-left">
                            <tr>
                                <th className="px-4 py-3">Nama Project</th>
                                <th className="px-4 py-3">Status</th>
                                <th className="px-4 py-3">Mulai</th>
                                <th className="px-4 py-3">Selesai</th>
                                <th className="px-4 py-3">Dibuat Oleh</th>
                                <th className="px-4 py-3 text-right">Aksi</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects?.data?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-6 text-gray-400">
                                        Belum ada project.
                                    </td>
                                </tr>
                            )}
                            {projects?.data?.map((project) => (
                                <tr key={project.id} className="border-t border-gray-100">
                                    <td className="px-4 py-3">{project.name}</td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs ${STATUS_BADGE[project.status]}`}>
                                            {STATUS_LABEL[project.status]}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-500">{project.start_date?.substring(0, 10) || '-'}</td>
                                    <td className="px-4 py-3 text-gray-500">{project.end_date?.substring(0, 10) || '-'}</td>
                                    <td className="px-4 py-3 text-gray-500">{project.creator?.name || '-'}</td>
                                    <td className="px-4 py-3 text-right">
                                        {hasPermission('project-management', 'can_edit') && (
                                            <button onClick={() => openEditModal(project)} className="text-blue-600 hover:text-blue-800 mr-3">
                                                <Pencil size={16} />
                                            </button>
                                        )}
                                        {hasPermission('project-management', 'can_delete') && (
                                            <button onClick={() => handleDelete(project)} className="text-red-600 hover:text-red-800">
                                                <Trash2 size={16} />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            <ProjectFormModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onSubmit={handleSubmit}
                initialData={editingProject}
                submitting={submitting}
            />
        </div>
    );
}