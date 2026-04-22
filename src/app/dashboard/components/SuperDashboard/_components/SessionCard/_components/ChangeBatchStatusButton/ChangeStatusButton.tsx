import style from "./ChangeStatusButton.module.css";

export default function ChangeStatusButton({ sessionStatus }) {
    return (
        <button>{session.is_active ? "DEACTIVATE" : "ACTIVATE"}</button>
    )
}