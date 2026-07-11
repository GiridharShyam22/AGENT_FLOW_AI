import "./styles/Input.css";

export default function Input({

    placeholder,

    value,

    onChange

}) {

    return (

        <input

            className="tf-input"

            placeholder={placeholder}

            value={value}

            onChange={onChange}

        />

    );

}