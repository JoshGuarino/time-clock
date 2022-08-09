import Link from "next/link";
import Image from "next/image";
import {supabase} from "../utils/supabaseClient";

export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-secondary">
            <div className="container-fluid">
                <div className="col-4">
                    <Link href="/">
                        <a><Image src="/time_clock_icon.png" width={50} height={50} alt="icon" /></a>
                    </Link>
                </div>
                <div className="col-5"></div>
                <div className="col-1">
                    <Link href="/">
                        <a className="btn btn-primary">Home</a>
                    </Link>
                </div>
                <div className="col-1">
                    <Link href="/shifts">
                        <a className="btn btn-info">Shifts</a>
                    </Link>
                </div>
                <div className="col-1">
                    <button className="btn btn-dark" onClick={() => supabase.auth.signOut()}>Sign Out</button>
                </div>
            </div>
        </nav>
    )
};