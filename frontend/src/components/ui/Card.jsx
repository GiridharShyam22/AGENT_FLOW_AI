import "./styles/Card.css";

export default function Card({
    children,
    title,
    subtitle,
    actions,
    className = "",
}) {
    return (
        <div className={`tf-card ${className}`}>
            {(title || subtitle || actions) && (
                <div className="tf-card-header">
                    <div>
                        {title && (
                            <h3 className="tf-card-title">
                                {title}
                            </h3>
                        )}

                        {subtitle && (
                            <p className="tf-card-subtitle">
                                {subtitle}
                            </p>
                        )}
                    </div>

                    {actions && (
                        <div className="tf-card-actions">
                            {actions}
                        </div>
                    )}
                </div>
            )}

            <div className="tf-card-content">
                {children}
            </div>
        </div>
    );
}