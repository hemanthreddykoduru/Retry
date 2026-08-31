export function FormField({ 
  label, 
  id, 
  type = "text", 
  placeholder,
  required = false
}: { 
  label: string; 
  id: string; 
  type?: string; 
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5 mb-4">
      <label htmlFor={id} className="text-sm font-medium text-text-primary">
        {label} {required && <span className="text-lost">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        required={required}
        className="px-3 py-2 border border-border rounded-md bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-active focus:border-transparent transition-shadow"
      />
    </div>
  );
}
