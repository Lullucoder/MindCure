/**
 * FormField Component
 * 
 * Reusable form input component with:
 * - Label support
 * - Error display
 * - Icon prefix/suffix
 * - Various input types
 * - Accessible attributes
 */

import { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

const FormField = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  error,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  inputClassName = '',
  required = false,
  disabled = false,
  helpText,
  children,
  ...props
}, ref) => {
  const hasError = !!error;
  const inputId = name;

  // Base input classes
  const baseInputClasses = `
    input-field
    ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
    ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
    ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
    ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
    ${inputClassName}
  `.trim();

  return (
    <div className={`space-y-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {/* Input wrapper */}
      <div className="relative">
        {/* Left icon */}
        {Icon && iconPosition === 'left' && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}

        {/* Input or custom children */}
        {children || (
          <input
            ref={ref}
            id={inputId}
            name={name}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            className={baseInputClasses}
            aria-invalid={hasError ? 'true' : 'false'}
            aria-describedby={hasError ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
            {...props}
          />
        )}

        {/* Right icon */}
        {Icon && iconPosition === 'right' && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <Icon className={`h-5 w-5 ${hasError ? 'text-red-400' : 'text-gray-400'}`} />
          </div>
        )}
      </div>

      {/* Help text */}
      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {/* Error message */}
      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

FormField.displayName = 'FormField';

/**
 * TextArea variant of FormField
 */
export const TextAreaField = forwardRef(({
  label,
  name,
  placeholder,
  error,
  className = '',
  inputClassName = '',
  required = false,
  disabled = false,
  helpText,
  rows = 4,
  ...props
}, ref) => {
  const hasError = !!error;
  const inputId = name;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <textarea
        ref={ref}
        id={inputId}
        name={name}
        rows={rows}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          input-field resize-none
          ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${inputClassName}
        `}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        {...props}
      />

      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

TextAreaField.displayName = 'TextAreaField';

/**
 * Select variant of FormField
 */
export const SelectField = forwardRef(({
  label,
  name,
  options = [],
  placeholder = 'Select an option',
  error,
  className = '',
  inputClassName = '',
  required = false,
  disabled = false,
  helpText,
  ...props
}, ref) => {
  const hasError = !!error;
  const inputId = name;

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <select
        ref={ref}
        id={inputId}
        name={name}
        disabled={disabled}
        className={`
          input-field
          ${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          ${inputClassName}
        `}
        aria-invalid={hasError ? 'true' : 'false'}
        aria-describedby={hasError ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-sm text-gray-500">
          {helpText}
        </p>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          className="text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

SelectField.displayName = 'SelectField';

/**
 * Checkbox variant
 */
export const CheckboxField = forwardRef(({
  label,
  name,
  error,
  className = '',
  disabled = false,
  helpText,
  children,
  ...props
}, ref) => {
  const hasError = !!error;
  const inputId = name;

  return (
    <div className={className}>
      <div className="flex items-start">
        <input
          ref={ref}
          id={inputId}
          name={name}
          type="checkbox"
          disabled={disabled}
          className={`
            h-4 w-4 mt-0.5 rounded border-gray-300
            text-primary-600 focus:ring-primary-500
            ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}
          `}
          aria-invalid={hasError ? 'true' : 'false'}
          aria-describedby={hasError ? `${inputId}-error` : undefined}
          {...props}
        />
        <label htmlFor={inputId} className="ml-2 block text-sm text-gray-700">
          {label || children}
        </label>
      </div>

      {helpText && !error && (
        <p className="mt-1 ml-6 text-sm text-gray-500">{helpText}</p>
      )}

      {error && (
        <p
          id={`${inputId}-error`}
          className="mt-1 ml-6 text-sm text-red-600 flex items-center gap-1"
          role="alert"
        >
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
});

CheckboxField.displayName = 'CheckboxField';

export default FormField;
