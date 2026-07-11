import "./styles/Button.css";

export default function Button({
    children,
    variant = "primary",
    size = "md",
    fullWidth = false,
    disabled = false,
    icon,
    onClick,
    type = "button",
}) {
    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
        tf-button
        ${variant}
        ${size}
        ${fullWidth ? "full" : ""}
      `}
        >
            {icon && (
                <span className="tf-button-icon">
                    {icon}
                </span>
            )}

            <span>{children}</span>
        </button>
    );
}