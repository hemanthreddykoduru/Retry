export function FormField({ 
  label, 
  id, 
  type = "text", 
  placeholder,
  required = false,
  autoComplete
}: { 
  label: string; 
  id: string; 
  type?: string; 
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
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
        autoComplete={autoComplete}
        className="w-full bg-surface border border-border rounded-md px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-active/20 focus:border-active transition-all"
      />
    </div>
  );
}
