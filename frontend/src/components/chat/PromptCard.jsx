import "./PromptCard.css";

export default function PromptCard({
    icon,
    title,
    description,
    onClick,
}) {
    return (
        <button
            className="prompt-card"
            onClick={onClick}
            type="button"
        >
            <div className="prompt-icon">
                {icon}
            </div>

            <div className="prompt-content">
                <h4>{title}</h4>

                <p>{description}</p>
            </div>
        </button>
    );
}