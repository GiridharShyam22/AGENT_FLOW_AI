import PromptCard from "./PromptCard";
import "./SuggestedPrompts.css";

const prompts = [
    {
        icon: "📁",
        title: "Create a new project",
        description: "Start a new workspace and organize your tasks."
    },
    {
        icon: "👥",
        title: "Invite team members",
        description: "Collaborate with your teammates instantly."
    },
    {
        icon: "🔗",
        title: "Connect Slack",
        description: "Integrate your workspace with Slack."
    },
    {
        icon: "💎",
        title: "Explore premium features",
        description: "Discover advanced AI capabilities."
    }
];

export default function SuggestedPrompts() {
    return (
        <section className="suggested-prompts">

            <h3>Suggested Questions</h3>

            <div className="prompt-grid">

                {prompts.map((prompt) => (

                    <PromptCard
                        key={prompt.title}
                        icon={prompt.icon}
                        title={prompt.title}
                        description={prompt.description}
                    />

                ))}

            </div>

        </section>
    );
}