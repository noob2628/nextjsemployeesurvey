import * as React from "react";

const Label = React.forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        className={`text-sm font-medium text-gray-700${className ? ` ${className}` : ""}`}
        ref={ref}
        {...props}
      />
    );
  }
);
Label.displayName = "Label";

export { Label };