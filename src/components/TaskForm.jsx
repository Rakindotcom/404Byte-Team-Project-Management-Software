import { useState, useEffect } from 'react';
import { useUsers } from '../context/UsersContext';
import { useAuth } from '../context/AuthContext';

export default function TaskForm({ projectId, initialData, defaultStatus = 'todo', onSubmit, onCancel }) {
    const { users } = useUsers();
    const { user } = useAuth();

    const [title, setTitle] = useState(initialData?.title || '');
    const [description, setDescription] = useState(initialData?.description || '');
    const [priority, setPriority] = useState(initialData?.priority || 'medium');
    const [status, setStatus] = useState(initialData?.status || defaultStatus);
    const [assignedTo, setAssignedTo] = useState(initialData?.assignedTo || user?.uid || '');
    const [deadline, setDeadline] = useState(initialData?.deadline || '');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!assignedTo && user?.uid) {
            setAssignedTo(user.uid);
        }
    }, [user?.uid]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const taskData = {
                title,
                description,
                priority,
                status,
                assignedTo,
                deadline: deadline || null,
                projectId: projectId || initialData?.projectId
            };
            await onSubmit(taskData);
        } finally {
            setLoading(false);
        }
    };

    const priorities = [
        { value: 'low', label: 'Low', color: 'text-[--accent-green]' },
        { value: 'medium', label: 'Medium', color: 'text-[--accent-yellow]' },
        { value: 'high', label: 'High', color: 'text-[--accent-red]' }
    ];

    const statuses = [
        { value: 'todo', label: 'To Do' },
        { value: 'in-progress', label: 'In Progress' },
        { value: 'review', label: 'Review' },
        { value: 'done', label: 'Done' }
    ];

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Task Title <span className="text-[--accent-red]">*</span>
                </label>
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-dark"
                    placeholder="e.g. Design homepage mockup"
                    required
                />
            </div>

            {/* Description */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-[--text-secondary]">
                    Description
                </label>
                <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="textarea-dark"
                    placeholder="Add more details about this task..."
                    rows={3}
                />
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
                {/* Priority */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Priority
                    </label>
                    <div className="flex space-x-2">
                        {priorities.map(p => (
                            <button
                                key={p.value}
                                type="button"
                                onClick={() => setPriority(p.value)}
                                className={`flex-1 py-2 px-3 text-sm rounded-lg border transition-all duration-200 font-medium ${priority === p.value
                                    ? `${p.color} bg-opacity-10 border-current shadow-sm`
                                    : 'text-[--text-muted] border-[--glass-border] hover:border-[--glass-border-hover] hover:bg-[--bg-tertiary] hover:text-[--text-secondary]'
                                    } ${priority === p.value && p.value === 'low' ? 'bg-[--accent-green]/10' : ''} ${priority === p.value && p.value === 'medium' ? 'bg-[--accent-yellow]/10' : ''} ${priority === p.value && p.value === 'high' ? 'bg-[--accent-red]/10' : ''}`}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Status
                    </label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="select-dark"
                    >
                        {statuses.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-2 gap-4">
                {/* Assignee */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Assign To
                    </label>
                    <select
                        value={assignedTo}
                        onChange={(e) => setAssignedTo(e.target.value)}
                        className="select-dark"
                    >
                        <option value="">Select team member</option>
                        {users.map(u => (
                            <option key={u.id} value={u.id}>{u.name}</option>
                        ))}
                    </select>
                </div>

                {/* Deadline */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-[--text-secondary]">
                        Due Date
                    </label>
                    <input
                        type="date"
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        className="input-dark"
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="btn-ghost"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="btn-primary inline-flex items-center space-x-2"
                    disabled={loading || !title.trim()}
                >
                    {loading ? (
                        <>
                            <div className="spinner spinner-sm"></div>
                            <span>Saving...</span>
                        </>
                    ) : (
                        <span>{initialData ? 'Update Task' : 'Create Task'}</span>
                    )}
                </button>
            </div>
        </form>
    );
}
