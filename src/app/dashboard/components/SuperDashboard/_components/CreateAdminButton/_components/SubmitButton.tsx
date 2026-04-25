import style from "./SubmitButton.module.css";
import { useFormStatus } from "react-dom";

export default function SubmitButton() {

    const { pending } = useFormStatus();

    return (
        <button>Create</button>
    )
}