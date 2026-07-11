import "./styles/Badge.css";

export default function Badge({
    children,
    color = "blue",
}) {
    return (
        <span className={`badge ${color}`}>
            {children}
        </span>
    );
}