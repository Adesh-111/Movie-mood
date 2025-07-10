import "./NavBar.css";
import data from "../../Context/ContextAPI";

function NavBar() {
    return ( <>
    <div className="movie-mood-navbar">
        <h1>
            <img src={data.logo} alt="" />
            {data.name}
        </h1>
        <ul className="movie-mood-navbar-list">
            <li>
                Home
            </li>
            <li>
                Movies
            </li>
            <li>
                Stats
            </li>
        </ul>
    </div>
    </> );
}

export default NavBar;