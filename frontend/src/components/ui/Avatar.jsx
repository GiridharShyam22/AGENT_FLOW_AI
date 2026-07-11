import "./styles/Avatar.css";

export default function Avatar({

    name = "AI"

}) {

    return (

        <div className="avatar">

            {name.charAt(0)}

        </div>

    );

}