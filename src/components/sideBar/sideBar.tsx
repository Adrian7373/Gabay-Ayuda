import style from "./sideBar.module.css";

export default function sideBar() {
    return (
        <div className={style.mainDiv}>
            <p>GABAY AYUDA</p>
            <button>DASHBOARD</button>
            <button>RECORDS</button>
        </div>

    )
}