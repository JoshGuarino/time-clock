export default function Navbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container-fluid">
                <div className="col-2">
                    <a className="navbar-brand" href="#">Time Clock</a>
                </div>
                <div className="col-8"></div>
                <div className="col-4">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <a className="nav-link" aria-current="page" href="#">Home</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Shifts</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
};