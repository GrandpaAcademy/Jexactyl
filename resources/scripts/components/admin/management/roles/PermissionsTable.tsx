import { getRolePermisisons, updateRole } from '@/api/routes/admin/roles';
import Spinner from '@/elements/Spinner';
import { useEffect, useState } from 'react';
import { PanelPermissions } from '@/state/server/permissions';
import AdminBox from '@/elements/AdminBox';
import Checkbox from '@/elements/inputs/Checkbox';
import Tooltip from '@/elements/tooltip/Tooltip';
import { Button } from '@/elements/button';
import { UserRole } from '@definitions/admin';
import SpinnerOverlay from '@/elements/SpinnerOverlay';

export default ({ role }: { role: UserRole }) => {
    const [permissions, setPermissions] = useState<PanelPermissions>();
    const [selected, setSelected] = useState<string[] | undefined>(role.permissions);
    const [submitting, setSubmitting] = useState<boolean>(false);

    const updateSelected = (value: string) => {
        setSelected(selected => {
            const current = selected ?? [];
            if (current.includes(value)) {
                return current.filter(v => v !== value);
            } else {
                return [value, ...current];
            }
        });
    };

    const save = () => {
        setSubmitting(true);
        updateRole(role.id, role.name, role.description, role.color, selected).then(() => setSubmitting(false));
    };

    useEffect(() => {
        getRolePermisisons().then(data => setPermissions(data.attributes.permissions));
    }, []);

    if (!permissions || !role) return <Spinner size={'large'} centered />;

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <SpinnerOverlay visible={submitting} />
                {Object.keys(permissions).map(key => {
                    const keys = Object.keys(permissions[key]?.keys ?? {});
                    const allSelected = keys.every(pkey => selected?.includes(`${key}.${pkey}`));
                    const someSelected = keys.some(pkey => selected?.includes(`${key}.${pkey}`));
                    const handleSelectAll = () => {
                        setSelected(selected => {
                            const current = selected ?? [];
                            if (allSelected) {
                                // Remove all keys in this group
                                return current.filter(v => !keys.map(pkey => `${key}.${pkey}`).includes(v));
                            } else {
                                // Add all keys in this group
                                const toAdd = keys.map(pkey => `${key}.${pkey}`).filter(k => !current.includes(k));
                                return [...current, ...toAdd];
                            }
                        });
                    };
                    return (
                        <AdminBox
                            title={key[0]?.toUpperCase() + key.slice(1, key.length).toString()}
                            key={key}
                            className="bg-zb-card/20 backdrop-blur-md border border-white/5 hover:border-zb-accent/20 transition-all duration-300"
                            button={
                                <Checkbox
                                    id={`select-all-${key}`}
                                    checked={allSelected}
                                    indeterminate={!allSelected && someSelected}
                                    onChange={handleSelectAll}
                                />
                            }
                        >
                            <p className="mb-6 text-neutral-400 text-xs opacity-70 leading-relaxed border-l border-white/10 pl-3">
                                {permissions[key]?.description}
                            </p>
                            
                            <div className="space-y-3">
                                {keys.map(pkey => (
                                    <div key={`${key}.${pkey}`} className="flex items-center group/item hover:translate-x-1 transition-transform duration-200">
                                        <Checkbox
                                            id={`${key}.${pkey}`}
                                            checked={selected?.includes(`${key}.${pkey}`) ?? false}
                                            name={`${key}.${pkey}`}
                                            onChange={() => updateSelected(`${key}.${pkey}`)}
                                        />
                                        <Tooltip placement={'top'} content={permissions[key]?.keys[pkey] ?? ''}>
                                            <div className="inline-flex my-auto ml-3 font-mono text-xs text-neutral-300 group-hover/item:text-zb-accent transition-colors">
                                                {`${key}.${pkey}`}
                                            </div>
                                        </Tooltip>
                                    </div>
                                ))}
                            </div>
                        </AdminBox>
                    );
                })}
            </div>
            <div className="fixed bottom-8 right-8 z-50">
                <Button onClick={save} className="shadow-zb-glow-sm/20 px-10 py-3 h-auto text-lg font-bold">
                    Deploy Role Permissions
                </Button>
            </div>
        </>
    );
};
